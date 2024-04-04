import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";

const Login = ({ onAccessToken }) => {
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        // For testing purposes, set a temporary access token
        const temporaryAccessToken = ""; 
        onAccessToken(temporaryAccessToken); // Pass the temporary token to the parent component
        setIsModalVisible(false); // Close the modal since we're using a temporary token
    }, []);

    const getAccessToken = () => {
        chrome.runtime.sendMessage(
            { action: "getAccessToken" },
            (response = {}) => {
                const { accessToken } = response;

                if (accessToken) {
                    setIsModalVisible(false);
                    getUserData(accessToken); // Ensure this is being called
                    onAccessToken(accessToken); // Pass accessToken to App.jsx
                } else {
                    setIsModalVisible(true);
                }
            }
        );
    }

    const loginWithGithub = () => {
        chrome.runtime.sendMessage({ action: "authenticateWithGitHub" });
    };

    async function getUserData(token) {
        try {
            const response = await fetch("https://api.github.com/user", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            console.log("User Data:", data); // This should log the user data

            setUserData(data);
            setIsModalVisible(false); // Hide modal on successful fetch
        } catch (error) {
            console.error("Error fetching GitHub user data:", error);
            setIsModalVisible(true);
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
        </>
    );
};

export default Login;