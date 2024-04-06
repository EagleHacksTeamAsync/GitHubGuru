import { ConfigProvider, theme, Card } from "antd";
import React, { useState } from "react";
import "../syles/App.css";
import Login from "./Login";
import Analytics from "./Analytics";
import Notificationsection from "./Notificationsection";
import PullRequestTab from "./PullRequestTab";

const App = () => {
  const [activeTab, setActiveTab] = useState("PR");
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

  const handleAccessToken = (token) => {
    setAccessToken(token);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Card
        title="Github Guru"
        className="base"
        tabList={tabs}
        activeTabKey={activeTab}
        onTabChange={(key) => setActiveTab(key)}
      >
        {activeTab === "Analytics" ? (
          <Analytics accessToken={accessToken} />
        ) : activeTab === "Notifs" ? (
          <Notificationsection accessToken={accessToken} /> 
        ) : activeTab === "PR" ? (
          <pullRequestTab accessToken={accessToken} />
        ) :
      
         (
          
          <h1>{activeTab}</h1>
        )}
      </Card>

      <Login onAccessToken={handleAccessToken} />
    </ConfigProvider>
  );
};

export default App;