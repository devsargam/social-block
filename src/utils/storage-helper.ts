import { StorageData } from "../types/types";

export const getStorageData = async (): Promise<StorageData> => {
  const data = await chrome.storage.sync.get([
    "blockedWebsitesArray",
    "websiteStates",
    "isGlobalEnabled",
  ]);

  return {
    blockedWebsitesArray: data.blockedWebsitesArray || [],
    websiteStates: data.websiteStates || {},
    isGlobalEnabled: data.isGlobalEnabled ?? true,
  };
};

export const setStorageData = async (
  data: Partial<StorageData>
): Promise<void> => {
  await chrome.storage.sync.set(data);
};
