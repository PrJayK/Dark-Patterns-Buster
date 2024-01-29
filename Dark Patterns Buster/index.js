document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("go-button").addEventListener("click", getUrl);
});

async function getUrl() {
    const urlElement = document.getElementById("url");
    var url = urlElement.value;
    urlElement.value = "";
    const response = await fetch("http://localhost:3000/url", {
        method : "POST",
        body: JSON.stringify({
            url : url
        }),
        headers:{
            "Content-type" : "application/json; charset=UTF-8",
        }
    });
}