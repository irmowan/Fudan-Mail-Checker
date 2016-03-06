/**
 * @author: Irmo(irmowan@gmail.com)
 */

var requestInterval = 10; // 10 minutes

function getMailUrl() {
    return "https://mail.fudan.edu.cn/";
}

function isMailUrl(url) {
    return url.indexOf(getMailUrl()) == 0;
}

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
                // TODO: Fix bug: if it cannot get in the inbox, it will also say "no unread mail."
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
        uid = localStorage["user"];
        password = localStorage["pswd"];
        xhr.send("locale=zh_CN&uid=" + uid + "&nodetect=false&domain=fudan.edu.cn&password=" + password + "&useSSL=true&action%3Alogin=");
        console.log("HTTP request posted.");
    } catch (e) {
        console.error("Cannot get in inbox.");
    }
}

function autoGetInboxCount() {
    getInboxCount();
    setTimeout(autoGetInboxCount, 1000 * 60 * requestInterval);
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
    });
    getInboxCount();
}

chrome.browserAction.onClicked.addListener(goToInbox);

if (chrome.runtime && chrome.runtime.onStartup) {
    chrome.runtime.onStartup.addListener(function() {
        console.log('Starting browser... updating icon.');
        autoGetInboxCount();
    });
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log("Received method: " + request.method);
    switch (request.method) {
        // TODO:getLocalStorage
        case "setLocalStorage":
            window.localStorage = request.data;
            // saveToStorage();
            // sendResponse({ data: localStorage });
            break;
        default:
    }
});
