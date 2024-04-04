function authenticateWithGitHub() {
  const clientId = "ae74d81ecc346767a9bc";
  const redirectUri = chrome.identity.getRedirectURL();
  const scope = "read:user";
  const authUrl = `https://github.com/login/oauth/authorize?client_id=ae74d81ecc346767a9bc&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&response_type=token`;

  chrome.identity.launchWebAuthFlow(
    {
      url: authUrl,
      interactive: true,
    },
    (redirectUrl) => {
      if (redirectUrl) {
        // Extract the access token from the redirect URL
        const urlParams = new URLSearchParams(
          new URL(redirectUrl).hash.substring(1)
        );
        const accessToken = urlParams.get("access_token");

        if (accessToken) {
          chrome.storage.local.set({ accessToken }, () => {
            console.log("Access token stored.");
          });
        } else {
          console.log("No access token found in the response.");
        }
      } else if (chrome.runtime.lastError) {
        // Log any errors encountered during the auth flow
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
      console.log("Sending back accessToken:", result.accessToken); // for debugging purposes
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
