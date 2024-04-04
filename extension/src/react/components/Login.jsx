import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";

const Login = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // This message is sent to the background script to request the current access token
    chrome.runtime.sendMessage(
      { action: "getAccessToken" },
      (response = {}) => {
        const { accessToken } = response;
        if (accessToken) {
          setIsModalVisible(false); // Hide login modal if accessToken exists
          getUserData(accessToken);
        } else {
          setIsModalVisible(true); // Ensure modal is shown if no accessToken, prompting login
        }
      }
    );
  }, []);

  const loginWithGithub = () => {
    // Send message to background script to initiate authentication
    chrome.runtime.sendMessage({ action: "authenticateWithGitHub" });
  };

  async function getUserData(token) {
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: { Authorization: `token ${token}` },
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching GitHub user data:", error);
    }
  }

  return (
    <>
      <Modal
        title="Login Required"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="login" type="primary" onClick={loginWithGithub}>
            Login with GitHub
          </Button>,
        ]}
        width={350}
        centered
      >
        <p>You must log in with GitHub to use this extension.</p>
      </Modal>

      {userData.login && (
        <div>
          <h1>Access Token Acquired</h1>
          <button
            onClick={() => {
              chrome.runtime.sendMessage({ action: "logout" }, () => {
                setIsModalVisible(true);
                setUserData({});
              });
            }}
          >
            Logout
          </button>

          <div>Hello There, {userData.login}</div>
        </div>
      )}
    </>
  );
};

export default Login;
