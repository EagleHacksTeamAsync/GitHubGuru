import { Select, Space, Switch } from "antd";
import React from "react";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;
const SelectRepo = ({repos, onChange, selectedRepo}) => {
    
    return (
        <Space >
             <Select
                showSearch
                style={{ width: 300 }}
                placeholder='Select Repository'
                optionFilterProp="children"
                onChange={onChange} 
                value={selectedRepo} 
                filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                }
            >
                {repos.map(repo => (
                    <Option key={repo.value} value={repo.value}>{repo.label}</Option>
                ))}
            </Select>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked
            />

      </Space>
      
    )
   
};

export default SelectRepo;