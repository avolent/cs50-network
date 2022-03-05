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
                    childBtn.addEventListener('click', () => post(childBtn.innerHTML))
                );
            } catch (error) {
                console.log(error)
            }
        }
    });
});

function post(btn) {
    const csrftoken = Cookies.get('csrftoken');
    if (btn == "Post") {
        console.log("Post");
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
    } else if (btn == "Edit"){
        console.log("Edit")
    } else if (btn == "&#128148;" , "&#128148;"){
        console.log("Like")
    }
    return false;
}