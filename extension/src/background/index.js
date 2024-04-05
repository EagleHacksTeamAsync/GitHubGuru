async function authenticateWithGitHub() {
    let clientId, clientSecret;

    try {
        const response = await fetch("../config/config.json");
        const data = await response.json();
        clientId = data.client_id;
        clientSecret = data.client_secret;
    } catch (error) {
        console.error("Error fetching config:", error);
        return;
    }

    console.log(clientId, clientSecret);

    const redirectUri = chrome.identity.getRedirectURL();
    const scope = "read:user";
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=token`;

    console.log(authUrl);
    console.log(redirectUri)

    chrome.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true,
    }, async (redirectUrl) => {
        if (!redirectUrl) {
            if (chrome.runtime.lastError) {
                console.log("Error or cancellation:", chrome.runtime.lastError.message);
            }
            return;
        }

        const urlParams = new URLSearchParams(redirectUrl.split("?")[1]);
        const code = urlParams.get("code");

        if (!code) {
            console.error("No code found in the redirect URL.");
            return;
        }

        try {
            const response = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: code
                })
            });

            const responseData = await response.json();
            console.log("GitHub response:", responseData)
            const accessToken = responseData['access_token'];

            if (accessToken) {
                chrome.storage.local.set({ accessToken }, () => {
                    console.log("Access token stored.");
                });
            } else {
                console.error("No access token found in the response.");
            }
        } catch (error) {
            console.error("Error fetching access token:", error);
        }
    });
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
    const iconPath = hasNotifications ? '../logo-2.png' : '../logo.png';
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
                    iconUrl: "../logo-2.png",
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

