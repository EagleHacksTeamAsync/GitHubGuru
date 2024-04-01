import { ConfigProvider, theme, Card } from 'antd';
import React, { useState } from 'react';
import '../syles/App.css';

const App = () => {
    const [activeTab, setActiveTab] = useState("Notifs");

    const tabs = [
        {
            key: "Notifs",
            tab: "Notifications",
        },
        {
            key: "PR",
            tab: "PRs",
        }
    ] 
    const content = {
        "Notifs": <h1>Notifications</h1>,
        "PR": <h1>PRs</h1>
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
            }}
        >  
            <Card 
                title="Github Guru" 
                className='base' 
                tabList={tabs}
                activeTabKey={activeTab}
                onTabChange={key => setActiveTab(key)}
            >
                {content[activeTab]}
            </Card>
        </ConfigProvider>
    );
};
export default App;