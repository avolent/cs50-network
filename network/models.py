from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def __str__(self):
        return f"ID:{self.id} - {self.username} | {self.email}"

class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User)

    def __str__(self):
        return f"Post: {self.id} | {self.user} posted the following '{self.body}' at {self.timestamp}. Current Likes: {self.likes}"

class Follower(models.Model):
    user = models.ForeignKey(User, unique=True, on_delete=models.CASCADE, related_name="follows")
    followers = models.ManyToManyField(User)
    def __str__(self):
        return f"{self.user}"

