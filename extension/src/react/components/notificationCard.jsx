import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import '../styles/App.css';

const NotificationCard = ({ url, title, number, reviewer }) => {
    const [isChecked, setIsChecked] = useState(false); // State to manage checked status

    // Toggle the checked state on button click
    const toggleChecked = () => {
        setIsChecked(!isChecked);
    };

    // Custom title component
    const titleComponent = (
        <div className="title-component">
            <span>{title} (PR #{number})</span>
            <Button 
                type={isChecked ? "primary" : "default"} // Change the button type based on isChecked
                size="small" 
                icon={isChecked ? <CheckOutlined /> : <CloseOutlined />} // Change the icon based on isChecked
                onClick={toggleChecked} // Handle button click
            />
        </div>
    );

    return (
        <Card 
            title={titleComponent} 
            bordered={true}
            size="small"
            style={{ width: 350 }}
        >
            <p>
                <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    @{reviewer} requested changes on this pull request
                </a>
            </p>        
    </Card>
    );
};

export default NotificationCard;
