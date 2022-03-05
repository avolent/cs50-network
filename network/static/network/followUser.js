document.addEventListener('DOMContentLoaded', function() {
    console.log("followUser.js loaded")
    const followbtn = document.querySelector('#followbtn');
    followbtn.onclick = () => follow();
});

function follow() {
    const csrftoken = Cookies.get('csrftoken');
    console.log(`${followbtn.value} ${followbtn.dataset.user}`);
    
    fetch('/follow', {
        method: 'POST',
        headers: { "X-CSRFToken": csrftoken },
        body: JSON.stringify({
            user: followbtn.dataset.user,
            action: followbtn.value,
        })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
    if (followbtn.value == "follow") {
        followbtn.innerHTML = "Unfollow";
        followbtn.value = "unfollow";
        document.querySelector('#followersCount').innerHTML = parseInt(document.querySelector('#followersCount').innerHTML) + 1;
    }
    else {
        followbtn.innerHTML = "Follow";
        followbtn.value = "follow";
        document.querySelector('#followersCount').innerHTML = parseInt(document.querySelector('#followersCount').innerHTML) - 1;
    };
}