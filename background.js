chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message?.kind === 'badge') {
        chrome.browserAction.setBadgeBackgroundColor({ tabId: sender?.tab?.id, color: '#32cd32' });
        chrome.browserAction.setBadgeText({ tabId: sender?.tab?.id, text: '✓'});
    }

    return true
})

chrome.browserAction.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage()
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo?.status !== 'loading') { return; }

    // chrome.storage.local.clear()

    chrome.tabs.executeScript(
        tabId,
        {
            "file": "psl.min.js",
            "runAt": "document_start"
        },
        () => {
            chrome.tabs.executeScript(
                tabId,
                {
                    "file": "inject.js",
                    "runAt": "document_start"
                },
                () => {}
            );
        }
    )    
});