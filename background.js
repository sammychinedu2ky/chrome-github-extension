chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getUsername") {
        chrome.storage.sync.get("githubUsername").then(sendResponse);
        return true;
    }
});
