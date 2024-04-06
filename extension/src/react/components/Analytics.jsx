import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Select, Divider } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchWeeklyCommitCount, fetchAllContributionCommitCount, fetchUserContributionCommitCount } from './commitDataFetcher';

const { Option } = Select;

const Analytics = ({ accessToken }) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [weeklyCommitCount, setWeeklyCommitCount] = useState(null);
  const [userCommitCount, setUserCommitCount] = useState(null);
  const [allContributionCommitCount, setAllContributionCommitCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reposList, setReposList] = useState([]);

  const fetchRepos = async () => {
    try {
      if (accessToken) {
        const response = await fetch('https://api.github.com/user/repos', {
          headers: {
            Authorization: `token ${accessToken}`
          }
        });
        const data = await response.json();
        setReposList(data);
      }
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
      if (accessToken && owner && repo) {
        const weeklyCount = await fetchWeeklyCommitCount(accessToken, owner, repo);
        setWeeklyCommitCount(weeklyCount);
  
        const userCount = await fetchUserContributionCommitCount(accessToken, owner, repo);
        setUserCommitCount(userCount);
  
        const allContributionCount = await fetchAllContributionCommitCount(accessToken, owner, repo);
        setAllContributionCommitCount(allContributionCount);
      }
    } catch (error) {
      console.error('Error fetching commit data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, [accessToken]);

  useEffect(() => {
    if (owner && repo) {
      fetchCommitData();
    }
  }, [owner, repo, accessToken]);

  return (
    <>
        <Divider orientation="left">Analytics</Divider>
        <Card>
            {/* Repo selection */}
            <div style={{ marginBottom: '20px' }}>
                <Select style={{ width: '100%' }} onChange={handleRepoChange} defaultValue="Select a Repository">
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

      {/* Display user commit count */}
      <div>
        <h3>Total User Commit Activity</h3>
        {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} /> : <p>{userCommitCount}</p>}
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
    </>

  );
};

export default Analytics;