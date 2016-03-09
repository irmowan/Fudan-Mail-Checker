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
    console.log("Updating icon with number " + num + '.');
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
                // Test whether succeed logging in.
                try {
                    regexp_test = /account/g;
                    var test = regexp_test.exec(xhr.responseText)[0];
                } catch (e) {
                    console.log("Cannot get in inbox, please check your settings.");
                    updateIcon(0);
                    return;
                }
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
        // Set the parameters and send the request.
        xhr.open("POST", getMailUrl() + "coremail/index.jsp", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        uid = localStorage["user"];
        password = localStorage["pswd"];
        if (uid == undefined || password == undefined) {
            console.log("User or password is empty.");
            return;
        }
        xhr.send("locale=zh_CN&uid=" + uid + "&nodetect=false&domain=fudan.edu.cn&password=" + password + "&useSSL=true&action%3Alogin=");
        console.log("HTTP request posted.");
    } catch (e) {
        console.error("Cannot get in inbox. Something wrong.");
    }
}

function autoGetInboxCount() {
    getInboxCount();
    if (localStorage["interval"] != undefined)
        requestInterval = localStorage["interval"];
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
        case "setLocalStorage":
            window.localStorage = request.data;
            console.log("Settings updated.");
            break;
        case "getInboxCount":
            getInboxCount();
            break;
        default:
    }
});
