import React, { useEffect, useState } from "react";
import SelectRepo from './selectRepo';
import NotificationCard from './notificationCard'; 
import { Space } from 'antd';
import { Octokit } from '@octokit/core';

const Notifications = () => {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null); 
  const [pullRequests, setPullRequests] = useState([]); 

  console.log(pullRequests);

// Fetch repositories from GitHub API
  useEffect(() => {
    const fetchRepos = async () => {
      const octokit = new Octokit({
        auth: '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' 
      });

      try {
        const response = await octokit.request('GET /user/repos', {
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });

        const repoOptions = response.data.map(repo => ({
          value: repo.full_name, 
          label: repo.full_name, 
        }));

        setRepos(repoOptions);
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      }
    };

    fetchRepos();
  }, []); 

  // Fetch pull requests when a repository is selected
  useEffect(() => {
    const fetchPullRequests = async () => {
      if (!selectedRepo) return; // Exit if no repo is selected

      const octokit = new Octokit({
        auth: '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' // Replace 'YOUR-TOKEN' with your actual GitHub token
      });

      try {
        const [owner, repo] = selectedRepo.split('/');
        const prsResponse = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner,
            repo
        });

        const prsWithChangeRequests = await Promise.all(prsResponse.data.map(async (pr) => {
            const reviewsResponse = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
                owner,
                repo,
                pull_number: pr.number
            });

            // Filter reviews to find those with CHANGES_REQUESTED
            const changeRequests = reviewsResponse.data.filter(review => review.state === 'CHANGES_REQUESTED').map(review => ({
                reviewer: review.user.login, // The GitHub username of the reviewer
            }));

            return {
              id: pr.id,
              url: pr.html_url,
              title: pr.title,
              number: pr.number,
              requestedChanges: changeRequests // Add our new field
            };
        }));

        setPullRequests(prsWithChangeRequests);
      } catch (error) {
          console.error("Failed to fetch pull requests or reviews:", error);
      }
    };

    fetchPullRequests();
  }, [selectedRepo]); // This effect depends on selectedRepo

  // Handler function to update the selected repository
  const handleRepoChange = (value) => {
    setSelectedRepo(value);
  };


  return (
    <Space direction="vertical" size="middle">
      <SelectRepo repos={repos} onChange={handleRepoChange} selectedRepo={selectedRepo}/>
      {pullRequests.flatMap(pr => 
          (pr.requestedChanges || []).map((request, index) => (
              <NotificationCard 
                  key={`${pr.id}-${index}`} // Unique key for each notification card
                  url={pr.url} // URL of the PR
                  title={pr.title} // Title of the PR
                  number={pr.number} // Number of the PR
                  reviewer={request.reviewer} // GitHub username of the reviewer
              />
          ))
      )}
    </Space>
  );
};

export default Notifications;