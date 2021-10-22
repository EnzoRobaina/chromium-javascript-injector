
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