function save_options() {
    localStorage["user"] = document.getElementById("username").value;
    localStorage["pswd"] = document.getElementById("password").value;
    localStorage["interval"] = document.getElementById("interval").value;
    //TODO:Test if the pswd is true(By send request);
    chrome.extension.sendRequest({ method: "setLocalStorage", data: localStorage });
    console.log("Save settings.")
    var status = document.getElementById("status");
    status.innerHTML = "保存成功";
    setTimeout(function() { status.innerHTML = ""; }, 1000);
    chrome.extension.sendRequest({ method: "getInboxCount"});
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#save').addEventListener('click', save_options);
});
