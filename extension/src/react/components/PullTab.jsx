import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Select, Divider } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchRepos, fetchPullRequestsWithChangeRequests } from './pullRequest';
const { Option } = Select;

const PullTab = ({ accessToken }) => {
  const [selectedRepo, setSelectedRepo] = useState('');
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reposList, setReposList] = useState([]);

  const fetchPullRequests = async () => {
    setLoading(true);
    try {
      if (accessToken && selectedRepo) {
        const pullRequests = await fetchPullRequestsWithChangeRequests(accessToken, selectedRepo);
        setPullRequests(pullRequests);
      }
    } catch (error) {
      console.error('Error fetching pull requests:', error);
    }
    setLoading(false);
  };

  const fetchReposList = async () => {
    try {
      if (accessToken) {
        const repos = await fetchRepos(accessToken);
        setReposList(repos);
      }
    } catch (error) {
      console.error('Error fetching repos:', error);
    }
  };

  useEffect(() => {
    fetchReposList();
  }, [accessToken]);

  const handleRepoChange = value => {
    setSelectedRepo(value);
  };

  useEffect(() => {
    if (selectedRepo) {
      fetchPullRequests();
    }
  }, [selectedRepo, accessToken]);

  return (
    <>
        <Divider orientation="left">Pull Requests</Divider>
        <Card>
            <div style={{ marginBottom: '20px' }}>
                <Select style={{ width: '100%' }} onChange={handleRepoChange} defaultValue="Select a Repository">
                {reposList.map(repo => (
                    <Option key={repo.id} value={`${repo.owner.login}/${repo.name}`}>{repo.full_name}</Option>
                ))}
                </Select>
            </div>

            <div>
                <Divider orientation="left">Change Requests</Divider>
                {loading ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
                ) : (
                <>
                    {pullRequests.map(pr => (
                    <Card size='small' key={pr.id} style={{ marginBottom: '10px' }}>
                        <a href={pr.url} target="_blank" rel="noopener noreferrer">{pr.title}</a>
                        <div>
                            {pr.requestedChanges.map((change, index) => (
                                <p key={index}>{change.reviewer}</p>
                            ))}
                        </div>
                    </Card>
                    ))}
                </>
                )}
            </div>

            <Button onClick={fetchPullRequests}>
                Refresh Pull Requests
            </Button>
        </Card>
    </>

  );
};

export default PullTab;