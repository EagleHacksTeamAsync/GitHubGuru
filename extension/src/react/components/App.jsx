import React, { useState, useEffect } from "react";
import { ConfigProvider, theme, Card, Menu, Dropdown } from "antd";
import Login from "./Login";
import Analytics from "./Analytics";
import "../styles/App.css"; // Make sure the path is correct, it was misspelled in your snippet

const App = () => {
  const [activeTab, setActiveTab] = useState("Notifs");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getAccessToken = () => {
      chrome.runtime.sendMessage({ action: "getAccessToken" }, (response = {}) => {
          const { accessToken } = response;

          if (accessToken) {
              getUserData(accessToken);
          }
      });
    };

    getAccessToken();
  }, []);

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
  const [accessToken, setAccessToken] = useState(null); // State to hold access token

  const tabs = [
    {
      key: "Notifs",
      tab: "Notifications",
    },
    {
      key: "PR",
      tab: "PRs",
    },
    {
      key: "Analytics",
      tab: "Analytics",
    },
  ];

  const content = {
    Notifs: <h1>Notifications</h1>,
    PR: <h1>PRs</h1>,
  };

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
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="app-container">
        <Card
          title={
            <div className="card-title-container">
              <span>Github Guru</span>
              {userData && (
                <Dropdown overlay={menu} trigger={['click']}>
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
          }
          className="base"
          tabList={tabs}
          activeTabKey={activeTab}
          onTabChange={setActiveTab}
        >
          {activeTab === "Analytics" ? (
          <Analytics accessToken={accessToken} />
        ) : (
          <h1>{activeTab}</h1>
        )}
        </Card>
        {!userData && <Login onLogin={loginWithGithub} />}
      </div>
    </ConfigProvider>
  );
};

export default App;