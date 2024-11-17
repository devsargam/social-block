export const reloadMatchingTabs = async (
  urlMatcher: (tabUrl: string) => boolean
): Promise<void> => {
  const allTabs = await chrome.tabs.query({});
  const matchingTabs = allTabs.filter(
    (tab) => tab.url && tab.id && urlMatcher(tab.url)
  );
  const reloadPromises = matchingTabs.map((tab) => chrome.tabs.reload(tab.id!));
  await Promise.all(reloadPromises);
};

export const isUrlMatch = (tabUrl: string, targetUrl: string): boolean => {
  try {
    const tabDomain = new URL(tabUrl).hostname;
    const targetDomain = new URL(targetUrl).hostname;
    return tabDomain.includes(targetDomain);
  } catch {
    return tabUrl.includes(targetUrl);
  }
};
