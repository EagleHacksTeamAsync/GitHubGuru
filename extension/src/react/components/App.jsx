import { ConfigProvider, theme, Card, Space } from 'antd';
import React, { useState } from 'react';
import '../styles/App.css';
import SegmentedComponent  from './segmented';
import SelectRepo from './selectRepo';
import PrCard from './prCard';

const App = () => {
    const [activeTab, setActiveTab] = useState("Notifs");

    const tabs = [
        {
            key: "Notifs",
            tab: "Notifications",
        },
        {
            key: "PR",
            tab: "Pull Requests",
        },
        {
            key: "Analytics",
            tab: "Analytics",
        },
    ];

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
                <Space direction="vertical" size="middle"> 
                    <SegmentedComponent tabs={tabs} onChange={setActiveTab} />
                    {activeTab === "Notifs" && (
                        <>
                            <SelectRepo />
                            <PrCard />
                            <PrCard />
                            <PrCard />
                            <PrCard />
                        </>
                    )}
                </Space>

            </Card>
        </ConfigProvider>
    );
};
export default App;