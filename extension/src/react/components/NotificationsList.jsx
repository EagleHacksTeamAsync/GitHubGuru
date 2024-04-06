import React, { useEffect, useState } from "react";
import "../styles/NotificationsList.css"

const NotificationsList = ({ notifications }) => {
    if (!notifications || notifications.length === 0) {
        return <p>No new notifications.</p>;
    }

    return (
        <div className="notifications-popup">
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id}>{notification.reason}: {notification.subject.title}</li>
                ))}
            </ul>       
        </div>
    );
};

export default NotificationsList;
