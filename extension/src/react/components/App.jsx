import { ConfigProvider, theme, Card, Space, Segmented } from "antd";
import React, { useState } from "react";
import "../styles/App.css";
import Login from "./Login";
import Notifications from './notifications';
import Analytics from "./Analytics";

const App = () => {
  const [accessToken, setAccessToken] = useState(null); // State to hold access token  
  const [activeTab, setActiveTab] = useState("Notifications");

    const tabs = ["Notifications", "Pull Requests", "Analytics",];

    // Directly handle tab change in App
    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    const handleAccessToken = (token) => { // handles access token from Login
      setAccessToken(token); // sets access token for Analytics.jsx
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
            }}
        >  
            <Card 
                title="Github Guru" 
                className='base' 
            >
                <div className="vertical-space">
                    <Segmented 
                        options={tabs} 
                        value={activeTab} // Ensure the currently active tab is highlighted
                        onChange={handleTabChange} 
                        block
                    />
                    {activeTab === "Notifications" && <Notifications />}
                    {activeTab === "Analytics" ? (
                      <Analytics accessToken={accessToken} />
                    ) : (
                      <h1>{activeTab}</h1>
                    )}
                </div>

            </Card>
            <Login onAccessToken={handleAccessToken}  />
        </ConfigProvider>
    );
};

export default App;