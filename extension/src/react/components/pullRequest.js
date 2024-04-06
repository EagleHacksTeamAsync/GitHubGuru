/**
 * Function to fetch reviews for a pull request
 * @param {string} accessToken - GitHub authorization access token
 * @param {string} owner - Owner of the repository
 * @param {string} repo - Repository name
 * @param {number} pullNumber - Pull request number
 * @returns {Promise<Array>} - Array of reviews
 */
export const fetchReviews = async (accessToken, owner, repo, pullNumber) => {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
  };
  
  /**
   * Function to fetch repositories from GitHub API
   * @param {*} accessToken - GitHub authorization access token
   * @returns - array of repositories
   */
  export const fetchRepos = async (accessToken) => {
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `token ${accessToken}`
        }
      });
      const data = await response.json();
      return data; // Return the fetched data
    } catch (error) {
      console.error('Error fetching repos:', error);
      return []; // Return an empty array in case of error
    }
  };
  
  /**
   * Function to fetch pull requests with change requests
   * @param {*} accessToken - GitHub authorization access token
   * @param {*} selectedRepo - selected repository in the format owner/repo
   * @returns - array of pull requests with change requests
   */
  export const fetchPullRequestsWithChangeRequests = async (accessToken, selectedRepo) => {
    try {
      if (!selectedRepo) return []; // Exit if no repo is selected
  
      const [owner, repo] = selectedRepo.split('/');
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`);
      const data = await response.json();
  
      const pullRequestsWithChangeRequests = await Promise.all(data.map(async pr => {
        const reviewsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/reviews`);
        const reviewsData = await reviewsResponse.json();
  
        const changeRequests = reviewsData.filter(review => review.state === 'CHANGES_REQUESTED').map(review => ({
          reviewer: review.user.login
        }));
  
        return {
          id: pr.id,
          url: pr.html_url, // Include html_url in the response
          title: pr.title,
          number: pr.number,
          requestedChanges: changeRequests
        };
      }));
  
      return pullRequestsWithChangeRequests;
    } catch (error) {
      console.error('Error fetching pull requests or reviews:', error);
      return [];
    }
  };