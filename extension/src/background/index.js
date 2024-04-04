function authenticateWithGitHub() {
    const clientId = "ae74d81ecc346767a9bc";
    const clientSecret = "bb4bcc3a40b7b7e78e41f26706c648d342e3870e";
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
                    redirectUrl.split("?")[1] // Discard everything before the hash
                );

                const code = urlParams.get("code");

                if (!code) {
                    console.error("No code found in the redirect URL.");
                    return;
                }

                const data = {
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: code
                };

                fetch('https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => 
                        response.json()
                    )
                    .then((data) => {
                        const accessToken = data['access_token'];
                        chrome.storage.local.set({ accessToken }, () => {
                            console.log("Access token stored.");
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching access token:", error);
                    });

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
