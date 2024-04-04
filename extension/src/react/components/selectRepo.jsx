import { Select, Space, Switch } from "antd";
import React from "react";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';


const SelectRepo = () => {

    
    return (
        <Space >
            <Select
            showSearch
            style={{ width: 300 }}
            placeholder='Select Repository'
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
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked
            />

      </Space>
      
    )
   
};

export default SelectRepo;