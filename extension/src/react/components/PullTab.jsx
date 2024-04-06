import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchRepos, fetchPullRequestsWithChangeRequests, fetchReviews } from './pullRequest';
const { Option } = Select;

const PullTab = ({ accessToken }) => {
  const [selectedRepo, setSelectedRepo] = useState('');
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reposList, setReposList] = useState([]);

  const fetchPullRequests = async () => {
    setLoading(true);
    try {
      const pullRequests = await fetchPullRequestsWithChangeRequests(accessToken, selectedRepo);
      setPullRequests(pullRequests);
    } catch (error) {
      console.error('Error fetching pull requests:', error);
    }
    setLoading(false);
  };

  const fetchReposList = async () => {
    try {
      const repos = await fetchRepos(accessToken);
      setReposList(repos);
    } catch (error) {
      console.error('Error fetching repos:', error);
    }
  };

  useEffect(() => {
    fetchReposList();
  }, []);

  const handleRepoChange = value => {
    setSelectedRepo(value);
  };

  useEffect(() => {
    if (selectedRepo) {
      fetchPullRequests();
    }
  }, [selectedRepo]);

  return (
    <Card title="Pull Requests">
      {/* Repo selection */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Select Repository:</h3>
        <Select style={{ width: 200 }} onChange={handleRepoChange} defaultValue="Select">
          {reposList.map(repo => (
            <Option key={repo.id} value={`${repo.owner.login}/${repo.name}`}>{repo.full_name}</Option>
          ))}
        </Select>
      </div>

      {/* Display pull requests */}
      <div>
        <h3>Pull Requests with Change Requests</h3>
        {loading ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
        ) : (
          <ul>
            {pullRequests.map(pr => (
              <li key={pr.id}>
                <a href={pr.url} target="_blank" rel="noopener noreferrer">{pr.title}</a>
                <ul>
                  {pr.requestedChanges.map((change, index) => (
                    <li key={index}>{change.reviewer}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Refresh button */}
      <Button onClick={fetchPullRequests}>
        Refresh Pull Requests
      </Button>
    </Card>
  );
};

export default PullTab;