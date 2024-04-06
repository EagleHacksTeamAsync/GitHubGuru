import React, { useState, useEffect } from "react";
import { Card, Divider } from "antd";

const NotificationsList = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        chrome.storage.local.get(["notifications"], (result) => {
            if (result.notifications) {
                setNotifications(result.notifications);
            }
        });
    }, []);

    if (notifications.length === 0) {
        return <p>No new notifications.</p>;
    }

    return (
        <>
            <Divider orientation="left">Notifications</Divider>
            <div className="notifications-popup">
                {notifications.map(notification => (
                    <Card size='small' title={notification.reason} style={{ marginBottom: '10px' }}>
                        <p>{notification.subject.title}</p>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default NotificationsList;

