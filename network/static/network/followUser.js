document.addEventListener('DOMContentLoaded', function() {
    console.log("JS loaded")
    // document.querySelector('#followbtn').addEventListener('click', () => follow());
    const button = document.querySelector('#followbtn')
    button.onclick = () => follow(button);
});

function follow(button) {
    const csrftoken = Cookies.get('csrftoken');
    console.log("Follow User");
    console.log(button)

    // fetch('/post', {
    //     method: 'POST',
    //     headers: { "X-CSRFToken": csrftoken },
    //     body: JSON.stringify({
    //         user: user
    //     })
    // })
    // .then(response => response.json())
    // .then(result => {
    //     // Print result
    //     console.log(result);
    // });
}