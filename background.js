
function getMailUrl() {
    return "https://mail.fudan.edu.cn/";
}

function isMailUrl() {
    alert(url.indexOf(getMailUrl()));
    return url.indexOf(getMailUrl()) == 0;
}

function goToInbox() {
    console.log('Going to fudan mail inbox...');
    // TODO: Fix Bug
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
        // for (var i = 0, tab; tab = tabs[i]; i++) {
        //     alert(tab.url);
        //     if (tab.url && isMailUrl(tab.url)) {
        //         alert("found");
        //         console.log('Found fudan mail tab: ' + tab.url + '. ' +
        //             'Focusing and refreshing count...');
        //         chrome.tabs.update(tab.id, {selected: true});
        //         startRequest({
        //             scheduleRequest: false,
        //             showLoadingAnimation: false
        //         });
        //         return;
        //     }
        // }
        // console.log('Could not find Fudan mail tab. Creating one...');
        chrome.tabs.create({url: getMailUrl()});
    });
}

chrome.browserAction.onClicked.addListener(goToInbox);
