chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log(await chrome.storage.sync.get(
    {
      blockedWebsites: [],
    },
  ))

  if (changeInfo.status === 'complete' &&  tab?.url?.includes("example.com")) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['js/content.js'],
    }).then(() => {
      console.log('Injected content.js into ' + tab.url);
    }).catch(err => {
      console.error(err);
    });
  }
});
