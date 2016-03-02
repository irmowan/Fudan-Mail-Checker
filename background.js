/**
 * @author: Irmo(irmowan@gmail.com)
 */

function autoSSL() {
    console.log("Auto select the SSL checkbox.")
    var checkboxSSL = document.getElementsByName("useSSL")[0];
    checkboxSSL.checked = true;
}

function getMailUrl() {
    return "http://mail.fudan.edu.cn/";
}

function isMailUrl(url) {
    return url.indexOf(getMailUrl()) == 0;
}

function logIn() {
    var loginButton = document.getElementsByName("action:login")[0];
    console.log(loginButton);
    loginButton.click();
}

// TODO: updateIcon
function updateIcon() {

}

// TODO: Get inbox unread count
function getInboxCount() {
    xhr = new XMLHttpRequest();
    try {
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
            if (xhr.responseXML) {
                alert(xhr.responseXML);
                var xmlDoc = xhr.responseXML;
            }
        }
        xhr.open("POST", getMailUrl() + "coremail/index.jsp", true);
        // TODO:!!Notice: Here uid and password should be replaced.
        // TODO: Use localStorage, avoid making uid and password written in code.
        uid = "";
        password = "";
        xhr.send("locale=zh_CN&uid=" + uid + "&nodetect=false&domain=fudan.edu.cn&password=" + password + "&useSSL=true&action:login=");
        console.log("HTTP request posted.");
        alert(xhr.responseXML);
    } catch (e) {
        console.error("Cannot get in inbox.");
    }
}

function goToInbox() {
    console.log('Going to fudan mail inbox...');
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
        for (var i = 0, tab; tab = tabs[i]; i++) {
            if (tab.url && isMailUrl(tab.url)) {
                console.log('Found fudan mail tab: ' + tab.url + '. ' + 'Focusing and refreshing count...');
                chrome.tabs.update(tab.id, {
                    selected: true
                });
                return;
            }
        }
        console.log('Could not find fudan mail tab. Creating one...');
        chrome.tabs.create({
            url: getMailUrl()
        });
        // chrome.tabs.executeScript({
        //     file: "login.js"
        // });
    });
    getInboxCount();
}

chrome.browserAction.onClicked.addListener(goToInbox);
