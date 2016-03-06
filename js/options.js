function save_options() {
    localStorage["user"] = document.getElementById("username").value;
    localStorage["pswd"] = document.getElementById("password").value;
    //TODO:Test if the pswd is true(By send request);
    chrome.extension.sendRequest({method: "setLocalStorage", data: localStorage});
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#save').addEventListener('click', save_options);
});
