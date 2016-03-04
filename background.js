/**
 * @author: Irmo(irmowan@gmail.com)
 */

function autoSSL() {
    console.log("Auto select the SSL checkbox.")
    var checkboxSSL = document.getElementsByName("useSSL")[0];
    checkboxSSL.checked = true;
}

function getMailUrl() {
    return "https://mail.fudan.edu.cn/";
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
function updateIcon(num) {
    console.log("updating icon.");
    if (num > 0) {
        chrome.browserAction.setBadgeText({ text: num + '' });
    } else {
        chrome.browserAction.setBadgeText({ text: '' });
    }
}

function getInboxCount() {
    xhr = new XMLHttpRequest();
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;
            if (xhr.responseText) {
                console.log("Get HTTP response.");
                // Get the number of unread mails in inbox.
                try {
                    regexp = /id="navNewCount_1">\((\d+)\)/g;
                    var unread = regexp.exec(xhr.responseText)[1];
                    console.log("You have " + unread + " unread mail(s).");
                    updateIcon(parseInt(unread));
                } catch (e) {
                    console.log("No unread mail.");
                    updateIcon(0);
                }
            }
        }
        xhr.open("POST", getMailUrl() + "coremail/index.jsp", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // TODO:!!Notice: Here uid and password should be replaced.
        // TODO: Use localStorage, avoid making uid and password written in code.
        uid = "";
        password = "";
        xhr.send("locale=zh_CN&uid=" + uid + "&nodetect=false&domain=fudan.edu.cn&password=" + password + "&useSSL=true&action%3Alogin=");
        console.log("HTTP request posted.");
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
                chrome.tabs.update(tab.id, { selected: true });
                return;
            }
        }
        console.log('Could not find fudan mail tab. Creating one...');
        chrome.tabs.create({ url: getMailUrl() });
        // chrome.tabs.executeScript({
        //     file: "login.js"
        // });
    });
    getInboxCount();
}

chrome.browserAction.onClicked.addListener(goToInbox);
