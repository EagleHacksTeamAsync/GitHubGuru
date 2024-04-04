// commitDataFetcher.js

/**
 * Function to fetch user profile information
 * @param {*} accessToken - GitHub authorization access token 
 * @returns - username of user
 */
export const fetchUsername = async (accessToken) => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const userData = await response.json();
      console.log('Username:', userData.login); // Log the username
      return userData.login;
    } catch (error) {
      console.error('Error fetching username:', error);
      return null;
    }
  };
  
  /**
   * Fetches user events from GitHub
   * @param {*} accessToken - GitHub authorization access token 
   * @param {*} username - username of user
   * @returns - user's events
   */
  export const fetchUserEvents = async (accessToken, username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/events`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const eventData = await response.json();
      return eventData;
    } catch (error) {
      console.error('Error fetching user events:', error);
      return null;
    }
  };
  
  /**
   * Filters array of events based on event type
   * @param {*} events - Array of events
   * @param {*} eventType - event type such as 'PushEvent'
   * @returns - returns parsed array of eventType
   */
  export const filterEventsByType = (events, eventType) => {
    return events.filter(event => event.type === eventType);
  };
  
  /**
   * Iterates through an array of events and calculates total commits
   * @param {*} events - array of events
   * @returns - total count of commits
   */
  export const calculateCommitCount = (events) => {
    return events.reduce((acc, event) => acc + event.payload.commits.length, 0);
  };
  
  /**
   * Calculates total number of commits made within the last year
   * @param {*} accessToken - GitHub authorization access token 
   * @returns - sum of total commits from up to a year ago
   */
 /**
   * Returns total number of commits by a user
   * @param {*} accessToken - GitHub authorization access token
   * @returns - sum of total number of commits
   */
 export const fetchUserContributionCommitCount = async (accessToken, owner, repo) => {
    try {
      const username = await fetchUsername(accessToken); // Fetch username associated with the access token
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const commitData = await response.json();
      const userCommits = commitData.filter(commit => commit.author && commit.author.login === username); // Filter commits by the author's username
      const allContributionCommitCount = userCommits.length;
      console.log('All Contribution Commit Count:', allContributionCommitCount); // Log the all contribution commit count
      return allContributionCommitCount;
    } catch (error) {
      console.error('Error fetching all-time commit count:', error);
      return null;
    }
  };
  
  
  /**
   * Calculates total number of public commits made within the last week
   * @param {*} accessToken - GitHub authorization access token 
   * @returns - sum of total number of public commits within the last week
   */
  export const fetchWeeklyCommitCount = async (accessToken, owner, repo) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const commitData = await response.json();
      const today = new Date();
      const startOfLastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 6 - 7); // Monday of last week
      const endOfLastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 1 - 7); // Sunday of last week
      const weeklyCommits = commitData.filter(commit => {
        const commitDate = new Date(commit.commit.author.date);
        return commitDate >= startOfLastWeek && commitDate <= endOfLastWeek;
      });
      const weeklyCommitCount = weeklyCommits.length;
      console.log('Weekly Commit Count:', weeklyCommitCount); // Log the weekly commit count
      return weeklyCommitCount;
    } catch (error) {
      console.error('Error fetching weekly commit count:', error);
      return null;
    }
  };
  
  /**
   * Returns total number of commits by a user
   * @param {*} accessToken - GitHub authorization access token
   * @returns - sum of total number of commits
   */
  export const fetchAllContributionCommitCount = async (accessToken, owner, repo) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const commitData = await response.json();
      const allContributionCommitCount = commitData.length;
      console.log('All Contribution Commit Count:', allContributionCommitCount); // Log the all contribution commit count
      return allContributionCommitCount;
    } catch (error) {
      console.error('Error fetching all-time commit count:', error);
      return null;
    }
  };
