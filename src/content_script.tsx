import { normalizeURL } from "./utils/normalize-url";

const restrictedSites = new Set<string>();

chrome.storage.sync.get(
  ["blockedWebsitesArray", "websiteStates", "isGlobalEnabled"],
  (data) => {
    const blockedWebsitesArray: string[] = data.blockedWebsitesArray || [];
    const websiteStates = data.websiteStates || {};
    const isGlobalEnabled = data.isGlobalEnabled ?? true;

    if (blockedWebsitesArray.length > 0) {
      blockedWebsitesArray.forEach((item) => {
        if (isGlobalEnabled && websiteStates[item]?.isEnabled !== false) {
          restrictedSites.add(normalizeURL(item.toLowerCase()));
        }
      });
      checkIfRestricted();
    }
  }
);

function shouldBlockWebsite(): boolean {
  const currentHostname = normalizeURL(window.location.hostname);
  return restrictedSites.has(currentHostname);
}

function createBlockedPage(): void {
  const blockedPage = generateHTML();
  const style = generateStyling();
  const head = document.head || document.getElementsByTagName("head")[0];
  head.insertAdjacentHTML("beforeend", style);
  document.body.innerHTML = blockedPage;
}

function checkIfRestricted(): void {
  if (shouldBlockWebsite()) {
    createBlockedPage();
  }
}

function generateStyling(): string {
  return `
   <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
    }

    h1 {
      font-family: 'Poppins', sans-serif;
      font-size: 3.5rem;
      color: #d9534f;
      margin-bottom: 20px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .message {
      font-size: 1.5rem;
      color: #555;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
      padding: 0 20px;
    }

    .container {
      background-color: #ffffff;
      padding: 40px 30px;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s;
    }

    .container:hover {
      transform: scale(1.02);
    }

    .button {
      background-color: #007BFF;
      color: white;
      padding: 12px 24px;
      font-size: 1.1rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      margin-top: 20px;
      transition: background-color 0.3s, transform 0.3s;
    }

    .button:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }

    .footer {
      font-size: 0.9rem;
      color: #888;
      margin-top: 30px;
    }
  </style>
  `;
}

function generateHTML(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Site Blocked</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:wght@500&family=Ubuntu:wght@500&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="container">
        <h1>Access Blocked</h1>
        <p class="message">The site has been blocked to help you stay focused and productive.</p>
        <a href="#" class="button">Time to get back to work!</a>
        <div class="footer">©Social Block. All rights reserved.</div>
      </div>
    </body>
    </html>
  `;
}
