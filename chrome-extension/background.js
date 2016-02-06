chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
    if (tab.url.indexOf("facebook.com/messages") != -1) { // Inspect whether the place where user clicked matches with our list of URL
        chrome.tabs.executeScript(tab.id, {
            "file": "fbmanip.js"
        }, function () { // Execute your code
            console.log("Script executed");
        });
    } else {
      alert("Go to facebook.com/messages");
    }
});
