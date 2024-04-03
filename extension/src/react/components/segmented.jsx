import React from "react";
import { Segmented } from "antd";

const SegmentedComponent = ({ tabs, onChange }) => {
    // Transform tabs to the expected format if necessary
    const options = tabs.map(tab => tab.tab);

    // Adjust the onChange handler if necessary
    const handleChange = (value) => {
        // Find the key associated with the value and call the original onChange
        const tabKey = tabs.find(tab => tab.tab === value)?.key;
        if (tabKey) {
            onChange(tabKey);
        }
    };

    return <Segmented options={options} onChange={handleChange} block />;
};

export default SegmentedComponent;