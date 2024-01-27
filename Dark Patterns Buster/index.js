document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("go-button").addEventListener("click", getUrl);
});

function getUrl() {
    var url = document.getElementById("url").value;
    console.log(url);
}
