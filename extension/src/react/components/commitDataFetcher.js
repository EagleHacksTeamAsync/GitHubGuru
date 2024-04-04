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
export const fetchLastYearCommitCount = async (accessToken) => {
  try {
    const username = await fetchUsername(accessToken); // Pass accessToken
    const eventData = await fetchUserEvents(accessToken, username);
    const pushEvents = filterEventsByType(eventData, 'PushEvent');
    const lastYearEvents = pushEvents.filter(event => new Date(event.created_at) > new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    const lastYearCommitCount = calculateCommitCount(lastYearEvents);
  
    console.log('Last Year Commit Count:', lastYearCommitCount); // Log the last year commit count
    return lastYearCommitCount;
  } catch (error) {
    console.error('Error fetching last year commit count:', error);
    return null;
  }
};

/**
 * Calculates total number of public commits made within the last week
 * @param {*} accessToken - GitHub authorization access token 
 * @returns - sum of total number of public commits within the last week
 */
export const fetchWeeklyCommitCount = async (accessToken) => {
  try {
    const username = await fetchUsername(accessToken); // Pass accessToken
    const eventData = await fetchUserEvents(accessToken, username);
    const pushEvents = filterEventsByType(eventData, 'PushEvent');
    const weekAgo = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
    const weeklyEvents = pushEvents.filter(event => new Date(event.created_at) > weekAgo);
    const weeklyCommitCount = calculateCommitCount(weeklyEvents);
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
export const fetchAllContributionCommitCount = async (accessToken) => {
  try {
    const username = await fetchUsername(accessToken); // Pass accessToken
    const eventData = await fetchUserEvents(accessToken, username);
    const pushEvents = filterEventsByType(eventData, 'PushEvent');
    const allTimeCommitCount = calculateCommitCount(pushEvents);
    console.log('All Time Commit Count:', allTimeCommitCount); // Log the all time commit count
    return allTimeCommitCount;
  } catch (error) {
    console.error('Error fetching all-time commit count:', error);
    return null;
  }
};