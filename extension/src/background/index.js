function authenticateWithGitHub() {
    let clientId, clientSecret;

    fetch("../config/config.json")
        .then((response) => response.json())
        .then((data) => {
            clientId = data.clientId;
            clientSecret = data.clientSecret;
        })
        .catch((error) => {
            console.error("Error fetching config:", error);
        });

    const redirectUri = chrome.identity.getRedirectURL();
    const scope = "repo,read:user,notifications,read:org";
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

                        if(accessToken) {
                            chrome.storage.local.set({ accessToken }, () => {
                                console.log("Access token stored.");
                            });
                        }
                        else {
                            console.error("No access token found in the response.");
                        }
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
