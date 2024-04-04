import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";

const Login = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { action: "getAccessToken" },
      (response = {}) => {
        const { accessToken } = response;
        console.log("Received accessToken response:", accessToken); // Debug log to confirm receipt
        if (accessToken) {
          setIsModalVisible(false);
          setIsLoggedIn(true);
          getUserData(accessToken); // Ensure this is being called
        } else {
          setIsModalVisible(true);
        }
      }
    );
  }, []);

  const loginWithGithub = () => {
    chrome.runtime.sendMessage({ action: "authenticateWithGitHub" });
  };

  async function getUserData(token) {
    console.log("Fetching user data with token:", token);
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("GitHub response:", response);
      const data = await response.json();
      console.log("User Data:", data); // This should log the user data
      setUserData(data);
      setIsModalVisible(false); // Hide modal on successful fetch
    } catch (error) {
      console.error("Error fetching GitHub user data:", error);
    }
  }

  return (
    <>
      <Modal
        title="Login Required"
        visible={isModalVisible && !userData} // Modal visibility controlled by userData state
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

      {userData && (
        <div>
          <h1>Access Token Acquired</h1>
          <button
            onClick={() => {
              chrome.runtime.sendMessage({ action: "logout" }, () => {
                setIsModalVisible(true);
                setUserData(null);
              });
            }}
          >
            Logout
          </button>

          <div>
            <h2>Hello There, {userData.login}</h2>
            <img
              src={userData.avatar_url}
              alt="User avatar"
              style={{ width: 100, height: 100, borderRadius: "50%" }}
            ></img>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
