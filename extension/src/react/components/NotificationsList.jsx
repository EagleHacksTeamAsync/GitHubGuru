import React, { useState, useEffect } from "react";
import "../styles/NotificationsList.css"

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
        <div className="notifications-popup">
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>
                        {notification.reason}: {notification.subject.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsList;
