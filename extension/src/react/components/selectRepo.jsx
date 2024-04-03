import { Select, Space } from "antd";
import React from "react";

const SelectRepo = () => {

    
    return (
        <Space wrap>
            <Select
           showSearch
           style={{ width: 350 }}
           placeholder="Search to Repository"
           optionFilterProp="children"
           filterOption={(input, option) => (option?.label ?? '').includes(input)}
           filterSort={(optionA, optionB) =>
             (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
           }
            options={[
                {
                value: 'repo 1',
                label: 'repo 1',
                },
                {
                value: 'repo 2',
                label: 'repo 2',
                },
                {
                value: 'repo 3',
                label: 'repo 3',
                },
                {
                value: 'repo 4',
                label: 'repo 4',
                },
            ]}
            />
      </Space>
    )
   
};

export default SelectRepo;