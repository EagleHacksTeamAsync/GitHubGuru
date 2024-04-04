function authenticateWithGitHub() {
  const clientId = "ae74d81ecc346767a9bc";
  const redirectUri = chrome.identity.getRedirectURL();
  const scope = "read:user";
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&response_type=token`;

  chrome.identity.launchWebAuthFlow(
    {
      url: authUrl,
      interactive: true,
    },
    (redirectUrl) => {
      if (redirectUrl) {
        const accessToken = new URLSearchParams(
          new URL(redirectUrl).hash.substring(1)
        ).get("access_token");
        chrome.storage.local.set({ accessToken: accessToken }, () => {
          console.log("Access token stored.");
        });
      } else if (chrome.runtime.lastError) {
        console.log("Error or cancellation:", chrome.runtime.lastError.message);
      }
    }
  );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "authenticateWithGitHub") {
    authenticateWithGitHub();
  } else if (message.action === "getAccessToken") {
    chrome.storage.local.get(["accessToken"], function (result) {
      sendResponse({ accessToken: result.accessToken });
    });
    return true;
  } else if (message.action === "logout") {
    chrome.storage.local.remove("accessToken", () => {
      console.log("Logged out.");
      sendResponse({});
    });
    return true;
  }
});
