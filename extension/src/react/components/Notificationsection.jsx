import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchRepos } from './fetchNotifications';

const { Option } = Select;

const Notificationsection = ({ accessToken }) => {
  const [reposList, setReposList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReposData = async () => {
    setLoading(true);
    try {
      const data = await fetchRepos(accessToken);
      setReposList(data);
    } catch (error) {
      console.error('Error fetching repos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReposData();
  }, []);

  return (
    <Card title="Notifications">
      {/* Repo selection */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Select Repository:</h3>
        <Select style={{ width: 200 }} defaultValue="Select">
          {reposList.map(repo => (
            <Option key={repo.id} value={repo.name}>{repo.name}</Option>
          ))}
        </Select>
      </div>

      {/* Refresh button */}
      <Button onClick={fetchReposData} loading={loading}>
        Refresh Repositories
      </Button>
    </Card>
  );
};

export default Notificationsection;