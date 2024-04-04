import React, { useState, useEffect } from 'react';
import { Card, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchWeeklyCommitCount, fetchLastYearCommitCount, fetchAllContributionCommitCount } from './commitDataFetcher';

const Analytics = ({ accessToken }) => { // Accept accessToken as a prop
  const [weeklyCommitCount, setWeeklyCommitCount] = useState(null);
  const [lastYearCommitCount, setLastYearCommitCount] = useState(null);
  const [allContributionCommitCount, setAllContributionCommitCount] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCommitData = async () => {
    setLoading(true);
    try {
      const weeklyCount = await fetchWeeklyCommitCount(accessToken); // Pass accessToken
      setWeeklyCommitCount(weeklyCount);

      const lastYearCount = await fetchLastYearCommitCount(accessToken); // Pass accessToken
      setLastYearCommitCount(lastYearCount);

      const allContributionCount = await fetchAllContributionCommitCount(accessToken); // Pass accessToken 
      setAllContributionCommitCount(allContributionCount);
    } catch (error) {
      console.error('Error fetching commit data:', error);
    }
    setTimeout(() => {
      setLoading(false); // Setting loading to false after a delay
    }, 1000); 
  };

  useEffect(() => {
    fetchCommitData();
  }, []);

  return (
    <Card title="Analytics">
      {/* Display weekly commit count */}
      <div>
        <h3>Weekly Commit Activity</h3>
        {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} /> : <p>{weeklyCommitCount}</p>}
      </div>

      {/* Display last year commit count */}
      <div>
        <h3>Last Year Commit Activity</h3>
        {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} /> : <p>{lastYearCommitCount}</p>}
      </div>

      {/* Display all contribution commit count */}
      <div>
        <h3>All Contribution Commit Activity</h3>
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