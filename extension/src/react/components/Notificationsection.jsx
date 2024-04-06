import React, { useState, useEffect } from 'react';
import { Card, Button, Select } from 'antd';
import { fetchRepos, fetchPullRequestsWithChangeRequests } from './fetchNotifications';
const { Option } = Select;

const Notificationsection = ({ accessToken }) => {
  const [reposList, setReposList] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReposData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleRepoChange = async value => {
    setSelectedRepo(value);
    try {
      const pullRequestsData = await fetchPullRequestsWithChangeRequests(accessToken, value);
      setPullRequests(pullRequestsData);
    } catch (error) {
      console.error('Error fetching pull requests:', error);
    }
  };

  useEffect(() => {
    fetchReposData();
  }, []);

  return (
    <Card title="Notifications">
      <div style={{ marginBottom: '20px' }}>
        <h3>Select Repository:</h3>
        <Select style={{ width: 200 }} defaultValue="Select" onChange={handleRepoChange}>
          {reposList?.map(repo => (
            <Option key={repo.id} value={repo.full_name}>{repo.full_name}</Option>
          ))}
        </Select>
      </div>

      <div>
        <h3>Pull Requests with Change Requests:</h3>
        <ul>
          {pullRequests?.map(pr => (
            <li key={pr.id}>
              <a href={pr.url}>{pr.title}</a> - #{pr.number}
            </li>
          ))}
        </ul>
      </div>

      <Button onClick={fetchReposData} loading={loading}>
        Refresh Repositories
      </Button>
    </Card>
  );
};

export default Notificationsection;