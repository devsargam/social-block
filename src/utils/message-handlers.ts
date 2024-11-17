import {
  BlockWebsiteMessage,
  UnblockWebsiteMessage,
  UpdateGlobalStateMessage,
  UpdateWebsiteStateMessage,
} from "../types/types";
import { getStorageData, setStorageData } from "./storage-helper";
import { reloadMatchingTabs, isUrlMatch } from "./tab-manager";
import { sendErrorResponse } from "./error-handler";

// Handle blocking a website
export async function handleBlockWebsite(
  message: BlockWebsiteMessage,
  sendResponse: Function
) {
  try {
    const data = await getStorageData();
    const updatedData = {
      blockedWebsitesArray: [...data.blockedWebsitesArray, message.website],
      websiteStates: {
        ...data.websiteStates,
        [message.website]: {
          isEnabled: message.isEnabled,
          website: message.website,
        },
      },
    };

    await setStorageData(updatedData);
    await reloadMatchingTabs((url) => isUrlMatch(url, message.website));
    sendResponse({ success: true });
  } catch (error: unknown) {
    sendErrorResponse(sendResponse, error);
  }
}

// Handle unblocking a website
export async function handleUnblockWebsite(
  message: UnblockWebsiteMessage,
  sendResponse: Function
) {
  try {
    const data = await getStorageData();
    const updatedData = {
      blockedWebsitesArray: data.blockedWebsitesArray.filter(
        (site) => site !== message.website
      ),
      websiteStates: Object.fromEntries(
        Object.entries(data.websiteStates).filter(
          ([key]) => key !== message.website
        )
      ),
    };

    await setStorageData(updatedData);
    await reloadMatchingTabs((url) => isUrlMatch(url, message.website));
    sendResponse({ success: true });
  } catch (error: unknown) {
    sendErrorResponse(sendResponse, error);
  }
}

// Handle global state updates
export async function handleGlobalStateUpdate(
  message: UpdateGlobalStateMessage,
  sendResponse: Function
) {
  try {
    const data = await getStorageData();
    await setStorageData({ isGlobalEnabled: message.isGlobalEnabled });

    const matcher = (url: string) =>
      data.blockedWebsitesArray.some((site) => isUrlMatch(url, site));

    await reloadMatchingTabs(matcher);
    sendResponse({ success: true });
  } catch (error: unknown) {
    sendErrorResponse(sendResponse, error);
  }
}

// Handle updates to website state
export async function handleWebsiteStateUpdate(
  message: UpdateWebsiteStateMessage,
  sendResponse: Function
) {
  try {
    const data = await getStorageData();
    const updatedData = {
      websiteStates: {
        ...data.websiteStates,
        [message.website]: {
          isEnabled: message.isEnabled,
          website: message.website,
        },
      },
    };

    await setStorageData(updatedData);
    await reloadMatchingTabs((url) => isUrlMatch(url, message.website));
    sendResponse({ success: true });
  } catch (error: unknown) {
    sendErrorResponse(sendResponse, error);
  }
}

// Handle clearing all blocked websites
export async function handleClearAllBlocked(sendResponse: Function) {
  try {
    const data = await getStorageData();
    const blockedSites = data.blockedWebsitesArray;

    await setStorageData({
      blockedWebsitesArray: [],
      websiteStates: {},
    });

    const matcher = (url: string) =>
      blockedSites.some((site) => isUrlMatch(url, site));

    if (data.isGlobalEnabled) {
      await reloadMatchingTabs(matcher);
    }
    sendResponse({ success: true });
  } catch (error: unknown) {
    sendErrorResponse(sendResponse, error);
  }
}
