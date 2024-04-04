import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import '../styles/App.css';

const NotificationCard = ({ pr }) => {
    const [isChecked, setIsChecked] = useState(false); // State to manage checked status

    // Toggle the checked state on button click
    const toggleChecked = () => {
        setIsChecked(!isChecked);
    };

    // Custom title component
    const titleComponent = (
        <div className="title-component">
            <span>Feature/mobile brands page (PR #18)</span>
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
            title={titleComponent} // Use the custom title component
            bordered={true}
            size="small"
            style={{ width: 350 }}
        >
            <p>@ragy2801 requested changes on this pull request</p>
        </Card>
    );
};

export default NotificationCard;
