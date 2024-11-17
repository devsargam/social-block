import { Message } from "./types/types";
import {
  handleBlockWebsite,
  handleUnblockWebsite,
  handleGlobalStateUpdate,
  handleWebsiteStateUpdate,
  handleClearAllBlocked,
} from "./utils/message-handlers";
import { setStorageData } from "./utils/storage-helper";

chrome.runtime.onInstalled.addListener(async () => {
  await setStorageData({
    blockedWebsitesArray: [],
    websiteStates: {},
    isGlobalEnabled: true,
  });
});

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    switch (message.action) {
      case "BLOCK_WEBSITE":
        handleBlockWebsite(message, sendResponse);
        break;

      case "UNBLOCK_WEBSITE":
        handleUnblockWebsite(message, sendResponse);
        break;

      case "UPDATE_GLOBAL_STATE":
        handleGlobalStateUpdate(message, sendResponse);
        break;

      case "UPDATE_WEBSITE_STATE":
        handleWebsiteStateUpdate(message, sendResponse);
        break;

      case "CLEAR_ALL_BLOCKED":
        handleClearAllBlocked(sendResponse);
        break;
    }

    return true;
  }
);
