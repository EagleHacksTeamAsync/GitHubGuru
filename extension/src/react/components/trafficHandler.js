// trafficHandler.js
const fetchTrafficData = async (accessToken, owner, repo) => {
    try {
      const trafficResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/traffic/views`, {
        headers: {
          Authorization: `token ${accessToken}`
        }
      });
      const trafficData = await trafficResponse.json();
  
      const cloneResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/traffic/clones`, {
        headers: {
          Authorization: `token ${accessToken}`
        }
      });
      const cloneData = await cloneResponse.json();
  
      return {
        trafficData: trafficData,
        cloneData: cloneData,
      };
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      throw error;
    }
  };
  
  export default fetchTrafficData;