import { ConfigProvider, theme, Card, Space, Segmented } from 'antd';
import React, { useState } from 'react';
import '../styles/App.css';
import Notifications from './notifications';

const App = () => {
    const [activeTab, setActiveTab] = useState("Notifications");

    const tabs = ["Notifications", "Pull Requests", "Analytics",];

    // Directly handle tab change in App
    const handleTabChange = (value) => {
        setActiveTab(value);
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
                </div>

            </Card>
        </ConfigProvider>
    );
};
export default App;