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


async function fetchEvents(accessToken) {
    try {
        const response = await fetch('https://api.github.com/events', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

function updateIcon(hasNotifications) {
    const iconPath = hasNotifications ? '../logo2.png' : '../logo.png';
    chrome.action.setIcon({ path: iconPath });
}
function testChromeNotification() {
    // Mock access token for testing
    const accessToken = "";

    // Call the chromeNotification function with the mock access token
    chromeNotification(accessToken);
}

testChromeNotification();

function chromeNotification(accessToken) {
    fetchEvents(accessToken)
        .then(events => {
            const message = events.length > 0 ? `You have ${events.length} new events.` : 'No new events.';
            chrome.notifications.create(
                {
                    type: "basic",
                    iconUrl: "logo2.png",
                    title: "GitHub Events",
                    message: message,
                    silent: false
                }
            );
        })
        .catch(error => console.error('Error fetching events:', error));
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Add Listener");
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
    } else if (message.action === "fetchEvents") {
        chrome.storage.local.get(["accessToken"], function (result) {
            fetchEvents(result.accessToken)
                .then(notifications => {
                    updateIcon(notifications.length > 0);
                    sendResponse(notifications);
                    chromeNotification(result.accessToken); // Pass accessToken
                });
        });
        return true;
    }
});

