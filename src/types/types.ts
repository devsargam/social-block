export interface WebsiteState {
  isEnabled: boolean;
  website: string;
}

export interface BlockWebsiteMessage {
  action: "BLOCK_WEBSITE";
  website: string;
  isEnabled: boolean;
}

export interface UnblockWebsiteMessage {
  action: "UNBLOCK_WEBSITE";
  website: string;
}

export interface UpdateGlobalStateMessage {
  action: "UPDATE_GLOBAL_STATE";
  isGlobalEnabled: boolean;
}

export interface UpdateWebsiteStateMessage {
  action: "UPDATE_WEBSITE_STATE";
  website: string;
  isEnabled: boolean;
}

export interface ClearAllBlockedMessage {
  action: "CLEAR_ALL_BLOCKED";
}

export type Message =
  | BlockWebsiteMessage
  | UnblockWebsiteMessage
  | UpdateGlobalStateMessage
  | UpdateWebsiteStateMessage
  | ClearAllBlockedMessage;

export interface StorageData {
  blockedWebsitesArray: string[];
  websiteStates: Record<string, WebsiteState>;
  isGlobalEnabled: boolean;
}
