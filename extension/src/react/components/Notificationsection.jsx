import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchRepositories, fetchPullRequestsWithChangeRequests } from "./notificationFetch";
import '../syles/App.css';

const { Option } = Select;

const Notifications = ({ accessToken }) => {
  const [selectedRepo, setSelectedRepo] = useState('');
  const [pullRequestsWithChangeRequests, setPullRequestsWithChangeRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reposList, setReposList] = useState([]);

  const fetchRepos = async () => {
    try {
      const repositories = await fetchRepositories(accessToken);
      setReposList(repositories);
    } catch (error) {
      console.error('Error fetching repos:', error);
    }
  };

  const handleRepoChange = value => {
    setSelectedRepo(value);
  };

  const fetchPullRequestsData = async () => {
    setLoading(true);
    try {
      const data = await fetchPullRequestsWithChangeRequests(accessToken, selectedRepo);
      setPullRequestsWithChangeRequests(data);
    } catch (error) {
      console.error('Error fetching pull requests data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  useEffect(() => {
    if (selectedRepo) {
      fetchPullRequestsData();
    }
  }, [selectedRepo]);

  return (
    <Card title="Notifications">
      {/* Repo selection */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Select Repository:</h3>
        <Select style={{ width: 200 }} onChange={handleRepoChange} defaultValue="Select">
          {reposList.map(repo => (
            <Option key={repo.value} value={repo.value}>{repo.label}</Option>
          ))}
        </Select>
      </div>

      {/* Display pull requests with change requests */}
      <div>
        <h3>Pull Requests with Change Requests</h3>
        {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} /> : (
          pullRequestsWithChangeRequests && pullRequestsWithChangeRequests.length > 0 ? (
            <ul>
              {pullRequestsWithChangeRequests.map(pr => (
                <li key={pr.id}>
                  <a href={pr.url}>{pr.title}</a>
                  <ul>
                    {pr.requestedChanges.map(change => (
                      <li key={change.reviewer}>{change.reviewer}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pull requests with change requests found.</p>
          )
        )}
      </div>

      {/* Refresh button */}
      <Button onClick={fetchPullRequestsData}>
        Refresh Data
      </Button>
    </Card>
  );
};

export default Notifications;