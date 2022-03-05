import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator
from .models import User, Post, Follower


def index(request):
    # Grab all current posts and order by timestamp
    posts = Post.objects.all().order_by("-timestamp").all()
    pages = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = pages.get_page(page_number)
    print(posts[0].likes.all())
    return render(request, "network/index.html", {
        "page_obj": page_obj,
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def profile(request, profile):
    user = User.objects.get(username=profile)
    follower = Follower.objects.get(user=user)
    followers = follower.followers.all()
    following = Follower.objects.filter(followers=user)
    print(following)
    posts = Post.objects.filter(user=user).order_by("-timestamp").all()
    pages = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = pages.get_page(page_number)
    return render(request, "network/user.html", {
        "profile": user,
        "page_obj": page_obj,
        "followers": followers,
        "following": following,
    })

@login_required
def following(request):
    following = Follower.objects.filter(followers=request.user)
    a = []
    for people in following:
        b = Post.objects.filter(user=people.user)
        for post in b:
            a.append(post)
    posts = sorted(a, key=lambda d: d.timestamp, reverse = True) 
    pages = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = pages.get_page(page_number)
    return render(request, "network/following.html", {
        "page_obj": page_obj,
    })

# APIs
@login_required
def post(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    print(data) 
    post = Post(user=request.user, body=data.get("body"))
    post.save()
    return JsonResponse({"message": "Post successfully created."}, status=201)

@login_required
def follow(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    user = User.objects.get(username=data.get("user"))
    if data.get("action")  == "follow":
        follower = Follower.objects.get(user=user)
        follower.followers.add(request.user)
    if data.get("action")  == "unfollow":
        follower = Follower.objects.get(user=user)
        follower.followers.remove(request.user)
    print(data)
    return JsonResponse({"message": "Follow/Unfollow request successful."}, status=202)