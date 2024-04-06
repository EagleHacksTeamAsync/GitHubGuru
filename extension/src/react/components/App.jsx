import React, { useState, useEffect } from "react";
import { ConfigProvider, theme, Card, Menu, Dropdown, Segmented } from "antd";
import Login from "./Login";
import Analytics from "./Analytics";
import NotificationsList from "./NotificationsList";
import "../styles/App.css"; // Make sure the path is correct, it was misspelled in your snippet

const App = () => {
    const [activeTab, setActiveTab] = useState("Notifications");
    const [userData, setUserData] = useState(null);
    const [accessToken, setAccessToken] = useState(null); // State to hold access token

    useEffect(() => {
        const getAccessToken = () => {
            chrome.runtime.sendMessage(
                { action: "getAccessToken" },
                (response = {}) => {
                    const { accessToken } = response;

                    if (accessToken) {
                        setAccessToken(accessToken);
                        getUserData(accessToken);
                    }
                }
            );
        };

        getAccessToken();
    }, [accessToken]);

    const getUserData = async (token) => {
        try {
            const response = await fetch("https://api.github.com/user", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            console.log("User Data:", data);
            setUserData(data);
        } catch (error) {
            console.error("Error fetching GitHub user data:", error);
        }
    };

    const loginWithGithub = () => {
        chrome.runtime.sendMessage({ action: "authenticateWithGitHub" });
    };

    const onLogout = () => {
        setUserData(null);
        chrome.runtime.sendMessage({ action: "logout" });
    };

    const tabs = ["Notifications", "Pull Requests", "Analytics",];

    const menu = (
        <Menu>
            <Menu.Item>
                <a href={userData?.html_url} target="_blank" rel="noopener noreferrer">
                    Profile
                </a>
            </Menu.Item>
            <Menu.Item key="logout" onClick={onLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );


    return (
        <ConfigProvider theme={{ 
            algorithm: theme.darkAlgorithm, 
            token: { fontFamily: "'Montserrat', sans-serif"} 
        }}>
            <Card className="base" styles={{ body: { padding: '18px' } }}>
                <div className="card-title-container">
                    <div className="header">
                        <img src="./images/logo-2.png" className="logo"/>
                        <h1 style={{ fontWeight: '600', fontSize:'20px'}}>Github Guru</h1>
                    </div>
                    
                    {userData && (
                        <Dropdown overlay={menu} trigger={["click"]}>
                            <a onClick={(e) => e.preventDefault()}>
                                <img
                                    src={userData.avatar_url}
                                    alt="User Avatar"
                                    className="user-avatar"
                                />
                            </a>
                        </Dropdown>
                    )}
                </div>

                <Segmented 
                    options={tabs} 
                    activeTab={activeTab} 
                    onChange={(tab) => setActiveTab(tab)}
                    block
                    style={{ marginBottom: '10px' }}
                />
                {activeTab === "Analytics" &&
                    <Analytics accessToken={accessToken} />
                }
                {!userData && 
                    <Login onLogin={loginWithGithub} />
                }
            </Card>
        </ConfigProvider>
    );
};

export default App;