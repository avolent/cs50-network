document.addEventListener('DOMContentLoaded', function() {
    console.log("JS loaded")
    document.querySelector('#postbtn').addEventListener('click', () => post());
});

function post() {
    console.log("Create post");
    const csrftoken = Cookies.get('csrftoken');
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