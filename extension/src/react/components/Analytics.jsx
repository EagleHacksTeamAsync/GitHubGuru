import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchWeeklyCommitCount, fetchAllContributionCommitCount, fetchUserContributionCommitCount } from './commitDataFetcher';

const { Option } = Select;

const Analytics = ({ accessToken }) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [weeklyCommitCount, setWeeklyCommitCount] = useState(null);
  const [userCommitCount, setUserCommitCount] = useState(null); // Corrected variable name
  const [allContributionCommitCount, setAllContributionCommitCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reposList, setReposList] = useState([]);

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

  const fetchCommitData = async () => {
    setLoading(true);
    try {
      const weeklyCount = await fetchWeeklyCommitCount(accessToken, owner, repo);
      setWeeklyCommitCount(weeklyCount);
  
      const userCount = await fetchUserContributionCommitCount(accessToken, owner, repo); // Corrected function name
      setUserCommitCount(userCount); // Corrected variable name
  
      const allContributionCount = await fetchAllContributionCommitCount(accessToken, owner, repo);
      setAllContributionCommitCount(allContributionCount);
    } catch (error) {
      console.error('Error fetching commit data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  useEffect(() => {
    if (owner && repo) {
      fetchCommitData();
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

      {/* Display weekly commit count */}
      <div>
        <h3>Weekly Commit Activity</h3>
        {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} /> : <p>{weeklyCommitCount}</p>}
      </div>

      {/* Display last year commit count */}
      <div>
        <h3>Total User Commit Activity</h3>
        {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} /> : <p>{userCommitCount}</p>} {/* Corrected variable name */}
      </div>

      {/* Display all contribution commit count */}
      <div>
        <h3>All Users' Contribution Commit Activity</h3>
        {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} /> : <p>{allContributionCommitCount}</p>}
      </div>

      {/* Refresh button */}
      <Button onClick={fetchCommitData}>
        Refresh Data
      </Button>
    </Card>
  );
};

export default Analytics;