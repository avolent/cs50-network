document.addEventListener('DOMContentLoaded', function() {
    console.log("post.js loaded")
    let btns = [
        document.querySelectorAll('#postbtn'),
        document.querySelectorAll('.postEdit'),
        document.querySelectorAll('.like'),
    ]
    btns.forEach(btn => {
        if (btn != null) {
            try {
                btn.forEach(childBtn =>
                    childBtn.addEventListener('click', () => post(childBtn))
                );
            } catch (error) {
                console.log(error)
            }
        }
    });
});

function post(btn) {
    const csrftoken = Cookies.get('csrftoken');
    if (btn.innerHTML == "Post") {
        console.log(btn);
        const body = document.querySelector('#postBody');
        fetch('/post', {
            method: 'POST',
            headers: { "X-CSRFToken": csrftoken },
            body: JSON.stringify({
                body: body.value,
                action: "create"
            })
        })
        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result);
        });
    } else if (btn.innerHTML == "Edit" || btn.innerHTML == "Save") {
        console.log(btn);
        let post = btn.parentElement;
        let body = post.querySelector(".postText");
        console.log(post);
        if (btn.innerHTML == "Edit") {
            body.innerHTML = (`<textarea>${body.innerHTML}</textarea>`)
            btn.innerHTML = "Save"
        } else {
            fetch('/post', {
                method: 'POST',
                headers: { "X-CSRFToken": csrftoken },
                body: JSON.stringify({
                    action: "edit",
                    post: post.id,
                    body: body.querySelector("textarea").value
                })
            })
            .then(response => response.json())
            .then(result => {
                // Print result
                console.log(result);
                body.innerHTML = body.querySelector("textarea").value;
                btn.innerHTML = "Edit";
            });
        }
    } else if (btn.innerHTML == "💔" || btn.innerHTML == "💓") {
        console.log(btn);
        let post = btn.parentElement.parentElement;
        fetch('/post', {
            method: 'POST',
            headers: { "X-CSRFToken": csrftoken },
            body: JSON.stringify({
                action: "like",
                post: post.id
            })
        })
        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result);
            let likes = btn.parentElement.children[1]
            if (btn.innerHTML == "💓") {
                btn.innerHTML = "💔";
                likes.innerHTML = parseInt(likes.innerHTML) + 1;
            } else {
                btn.innerHTML = "💓";
                likes.innerHTML = parseInt(likes.innerHTML) - 1;
            }
        });
    }
}