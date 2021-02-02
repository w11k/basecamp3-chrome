// as soon as base URL is "3.basecamp.com", trigger the extension by sending the basecampID to index.tsx file
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.split('/')[2] === '3.basecamp.com') {
        const basecampID = tab.url.split('/')[3];
        // get chrome extension options and pass them too
        chrome.storage.sync.get('quickDelay', (quickDelayDays) => {
            chrome.tabs.sendMessage(tab.id, {
                basecampID,
                options: {
                    quickDelayDays: quickDelayDays.quickDelay
                }
            });
        });
    }
});
