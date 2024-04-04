import React from "react";
import SelectRepo from './selectRepo';
import NotificationCard from './notificationCard'; 
import { Space } from 'antd';

const Notifications = () => {
  return (
    <Space direction="vertical" size="middle"> 
        <SelectRepo />
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
    </Space>
  );
};

export default Notifications;