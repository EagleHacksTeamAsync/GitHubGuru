import React from "react";
import { Card } from "antd";

const PrCard = ({ pr }) => {
    return (
        <Card 
            title="Feature/mobile brands page (PR #18)"
            bordered={true}
            size = "small"
            style={{ width: 350 }}
        >
            <p>@ragy2801 requested changs on this pull request</p>
        </Card>
    );
};

export default PrCard;