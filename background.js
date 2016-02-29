
// TODO: AutoSSL
function autoSSL() {

}

function getMailUrl() {
    return "http://mail.fudan.edu.cn/";
}

function isMailUrl(url) {
    return url.indexOf(getMailUrl()) == 0;
}

function goToInbox() {
    console.log('Going to fudan mail inbox...');
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
        for (var i = 0, tab; tab = tabs[i]; i++) {
            if (tab.url && isMailUrl(tab.url)) {
                console.log('Found fudan mail tab: ' + tab.url + '. ' +
                    'Focusing and refreshing count...');
                chrome.tabs.update(tab.id, {selected: true});
                startRequest({scheduleRequest: false, showLoadingAnimation: false});
                return;
            }
        }
        console.log('Could not find Fudan mail tab. Creating one...');
        chrome.tabs.create({url: getMailUrl()});
    });
}

chrome.browserAction.onClicked.addListener(goToInbox);
