document.addEventListener('DOMContentLoaded', function() {
    console.log("JS loaded")
    document.querySelector('#postbtn').addEventListener('click', () => post('create'));
});

function post(type) {
    const csrftoken = Cookies.get('csrftoken');
    
    if (type == "create") {
        console.log("Create post");
        const body = document.querySelector('#postBody');
        fetch('/post', {
            method: 'POST',
            headers: { "X-CSRFToken": csrftoken },
            body: JSON.stringify({
                body: body.value
            })
        })
        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result);
        });
    }
    return false;
}