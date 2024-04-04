import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Select } from 'antd';
import fetchTrafficData from './trafficHandler';
const { Option } = Select;

const Analytics = ({ accessToken }) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [reposList, setReposList] = useState([]);
  const [trafficData, setTrafficData] = useState(null);
  const [cloneData, setCloneData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRepos = async () => {
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `token ${accessToken}`
        }
      });
      const data = await response.json();
      setReposList(data);
    } catch (error) {
      console.error('Error fetching repos:', error);
    }
  };

  const handleRepoChange = value => {
    const selectedRepo = reposList.find(repo => repo.name === value);
    if (selectedRepo) {
      setOwner(selectedRepo.owner.login);
      setRepo(selectedRepo.name);
    }
  };

  const fetchTraffic = async () => {
    setLoading(true);
    try {
      const { trafficData, cloneData } = await fetchTrafficData(accessToken, owner, repo);
      setTrafficData(trafficData);
      setCloneData(cloneData);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  useEffect(() => {
    if (owner && repo) {
      fetchTraffic();
    }
  }, [owner, repo]);

  return (
    <Card title="Analytics">
      {/* Repo selection */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Select Repository:</h3>
        <Select style={{ width: 200 }} onChange={handleRepoChange} defaultValue="Select">
          {reposList.map(repo => (
            <Option key={repo.id} value={repo.name}>{repo.name}</Option>
          ))}
        </Select>
      </div>

      {/* Display repository traffic */}
      <div>
        <h3>Page Views</h3>
        {loading ? (
          <Spin />
        ) : (
          <p>{trafficData ? `${trafficData.count} views` : 'No data available'}</p>
        )}
      </div>

      {/* Display repository clones */}
      <div>
        <h3>Repo Clones</h3>
        {loading ? (
          <Spin />
        ) : (
          <p>{cloneData ? `${cloneData.count} views` : 'No data available'}</p>
        )}
      </div>

      {/* Refresh button */}
      <Button onClick={fetchTraffic}>
        Refresh Data
      </Button>
    </Card>
  );
};

export default Analytics;