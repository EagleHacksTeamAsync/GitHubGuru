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
    const scope = "read:user,notifications";
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;

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


async function fetchNotifications(accessToken) {
    try {
        const response = await fetch('https://api.github.com/notifications', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });
        if (!response.ok) {
            // Log or handle HTTP errors, e.g., 403 Forbidden
            console.error('HTTP Error:', response.status, response.statusText);
            const errorDetails = await response.text(); // or response.json() if the response is in JSON format
            console.error('Error Details:', errorDetails);
            return null; // or throw an error, depending on your error handling strategy
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
}



function updateIcon(hasNotifications) {
    const iconPath = hasNotifications ? '../images/gitLogo.svg' : '../images/gitLogoNotif.svg';
    chrome.action.setIcon({ path: iconPath });
}

function testChromeNotification() {
    chrome.storage.local.get(["accessToken"], function(result) {
        if (result.accessToken) {
            chromeNotification(result.accessToken);
        } else {
            console.error("Access token not found.");
        }
    });
}

testChromeNotification();

function chromeNotification(accessToken) {
    fetchNotifications(accessToken)
        .then(notifications => {
            const message = Array.isArray(notifications) && notifications.length > 0 
                ? `You have ${notifications.length} new notifications.` 
                : 'No new notifications.';
            const iconPath = Array.isArray(notifications) && notifications.length > 0 
                ? 'images/gitLogo.svg' 
                : 'images/gitLogoNotif.svg';
            const iconUrl = chrome.runtime.getURL(iconPath);
            console.log(iconUrl);

            chrome.notifications.create('', {
                type: "basic",
                iconUrl: iconUrl,
                title: "GitHub Notifications",
                message: message,
                silent: false
            });
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
        });
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
    } else if (message.action === "fetchNotifications") {
        chrome.storage.local.get(["accessToken"], function(result) {
            if (result.accessToken) {
                fetchNotifications(result.accessToken)
                    .then(notifications => {
                        updateIcon(notifications.length > 0);
                        sendResponse({ notifications: notifications });
                    })
                    .catch(error => {
                        console.error("Error fetching notifications:", error);
                        sendResponse({ error: error.toString() }); 
                    });
            } else {
                console.error("Access token not found.");
                sendResponse({ error: "Access token not found." }); 
            }
        });
        return true; 
    }    
});

