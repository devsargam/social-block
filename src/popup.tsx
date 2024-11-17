import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { normalizeURL } from "./utils/normalize-url";
import { Switch } from "./utils/toggle-switch";

const Options = () => {
  const [website, setWebsite] = useState("");
  const [blockedWebsites, setBlockedWebsites] = useState<
    { website: string; isEnabled: boolean }[]
  >([]);
  const [isGlobalEnabled, setIsGlobalEnabled] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(
      ["blockedWebsitesArray", "websiteStates", "isGlobalEnabled"],
      (data) => {
        const websites = data.blockedWebsitesArray || [];
        const states = data.websiteStates || {};

        setBlockedWebsites(
          websites.map((site: string) => ({
            website: site,
            isEnabled: states[site]?.isEnabled ?? true,
          }))
        );
        setIsGlobalEnabled(data.isGlobalEnabled ?? true);
      }
    );
  }, []);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  const handleBlockWebsite = () => {
    const isValidURL = (url: string) => {
      const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
      return pattern.test(url);
    };

    if (!isValidURL(website)) {
      alert("Error: Please enter a valid URL");
      return;
    }

    if (!website.trim()) {
      alert("Error: please enter a website URL");
      return;
    }

    const normalizedWebsite = normalizeURL(website.toLowerCase());

    if (
      blockedWebsites.some(
        (blocked) => normalizeURL(blocked.website) === normalizedWebsite
      )
    ) {
      alert("Error: URL is already blocked");
      return;
    }

    chrome.runtime.sendMessage(
      {
        action: "BLOCK_WEBSITE",
        website,
        isEnabled: true,
      },
      (response) => {
        if (response.success) {
          setBlockedWebsites((prev) => [
            ...prev,
            { website: website, isEnabled: true },
          ]);
          setWebsite("");
        }
      }
    );
  };

  const handleUnblockWebsite = (website: string) => {
    chrome.runtime.sendMessage(
      { action: "UNBLOCK_WEBSITE", website },
      (response) => {
        if (response.success) {
          setBlockedWebsites((prev) =>
            prev.filter((site) => site.website !== website)
          );
        }
      }
    );
  };

  const handleClearAll = () => {
    chrome.runtime.sendMessage({ action: "CLEAR_ALL_BLOCKED" }, (response) => {
      if (response.success) {
        setBlockedWebsites([]);
      }
    });
  };

  const toggleGlobalEnabled = () => {
    const newGlobalState = !isGlobalEnabled;
    setIsGlobalEnabled(newGlobalState);

    chrome.runtime.sendMessage(
      {
        action: "UPDATE_GLOBAL_STATE",
        isGlobalEnabled: newGlobalState,
      },
      () => {
        console.log(
          `Global blocking is now ${newGlobalState ? "enabled" : "disabled"}`
        );
      }
    );
  };

  const toggleWebsiteEnabled = (website: string) => {
    const newState = !isWebsiteEnabled(website);

    setBlockedWebsites((prev) =>
      prev.map((site) => {
        if (site.website === website) {
          return { ...site, isEnabled: newState };
        }
        return site;
      })
    );

    chrome.runtime.sendMessage(
      {
        action: "UPDATE_WEBSITE_STATE",
        website: website,
        isEnabled: newState,
      },
      () => {
        console.log(
          `Website "${website}" is now ${newState ? "enabled" : "disabled"}`
        );
      }
    );
  };

  const isWebsiteEnabled = (website: string) => {
    const websiteData = blockedWebsites.find(
      (site) => site.website === website
    );
    return websiteData?.isEnabled ?? true;
  };

  return (
    <div
      id="app"
      style={{
        width: "320px",
        padding: "20px",
        backgroundColor: "#1e1e2f",
        fontFamily: "Arial, sans-serif",
        color: "#e0e0e0",
        overflow: "hidden",
        boxShadow: "none",
      }}
    >
      <div
        id="header-container"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        <h1
          style={{
            fontSize: "24px",
            color: "#cfcfcf",
            margin: "0",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Social Block
        </h1>
      </div>

      <div
        id="content-container"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <section
          style={{
            backgroundColor: "#2a2a3d",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2
            style={{ fontSize: "18px", marginBottom: "12px", color: "#a3a3c2" }}
          >
            Add to Block List
          </h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Enter website URL"
              id="websiteInput"
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #3e3e5a",
                backgroundColor: "#1e1e2f",
                color: "#e0e0e0",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleBlockWebsite}
              id="blockButton"
              style={{
                backgroundColor: "#ff6666",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.3s",
              }}
            >
              Block
            </button>
          </div>
        </section>

        <section
          style={{
            backgroundColor: "#2a2a3d",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2
            style={{ fontSize: "18px", marginBottom: "12px", color: "#a3a3c2" }}
          >
            Blocked Websites
          </h2>
          <div id="blockedWebsitesDiv">
            {blockedWebsites.length > 0 ? (
              blockedWebsites.map((site, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    backgroundColor: "#333348",
                    marginBottom: "8px",
                    borderRadius: "5px",
                  }}
                >
                  <div
                    style={{
                      wordBreak: "break-all",
                      fontSize: "14px",
                      color: "#e0e0e0",
                    }}
                  >
                    {site.website}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#a3a3c2" }}>
                      Enabled:
                    </span>
                    <Switch
                      checked={isGlobalEnabled && site.isEnabled}
                      onChange={() => toggleWebsiteEnabled(site.website)}
                      id={`websiteSwitch-${index}`}
                    />
                  </div>
                  <button
                    onClick={() => handleUnblockWebsite(site.website)}
                    style={{
                      backgroundColor: "#ff4d4f",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#a3a3c2",
                  padding: "15px",
                }}
              >
                No websites have been blocked
              </div>
            )}
          </div>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
            gap: "10px",
          }}
        >
          <span style={{ color: "#a3a3c2", fontSize: "14px" }}>
            Global Blocking:
          </span>
          <Switch
            checked={isGlobalEnabled}
            onChange={toggleGlobalEnabled}
            id="globalSwitch"
          />
        </div>

        <button
          onClick={handleClearAll}
          style={{
            backgroundColor: "#ff4d4f",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            border: "none",
            fontWeight: "bold",
            marginTop: "20px",
            transition: "background-color 0.3s",
          }}
        >
          Delete All Blocked Websites
        </button>
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Options />
    </React.StrictMode>
  );
}
