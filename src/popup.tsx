import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();
  const [blockedUrls, setBlockedUrls] = useState<string[]>(
    []
  );

  useEffect(() => {
    chrome.storage.sync.get(
      {
        blockedWebsites: [],
      },
      (items) => {
        setBlockedUrls(items.blockedWebsites);
      }
    );
  }, []);


  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    chrome.storage.sync.set({
      blockedWebsites: [
        'https://www.example.com',
        'https://www.google.com',
        currentURL,
      ],
    });
  };

  return (
    <>
      <h1>Add a website to block</h1>
      {JSON.stringify(blockedUrls)}
      <input
        type="text"
        placeholder="https://www.example.com"
        onChange={(event) => setCurrentURL(event.target.value)}
      />
      <button onClick={changeBackground}>Change background</button>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
