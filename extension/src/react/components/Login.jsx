import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";

const CLIENT_ID = "ae74d81ecc346767a9bc";

const Login = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParams = urlParams.get("code");

        const accessToken = localStorage.getItem("accessToken");
        setIsModalVisible(!accessToken);

        if (codeParams && !accessToken) {
            async function getAccessToken() {
                await fetch(
                    `https://deploy-preview-22--github-guru-server.netlify.app/getAccessToken?code=${codeParams}`,
                    {
                        method: "GET",
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        if (data.access_token) {
                            localStorage.setItem("accessToken", data.access_token);
                            setRerender(!rerender);
                        }
                    });
            }

            getAccessToken();
        }
    }, [rerender]);

    async function getUserData() {
        await fetch(
            "https://deploy-preview-22--github-guru-server.netlify.app/getUserData",
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("accessToken"),
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUserData(data);
            });
    }

    function loginWithGithub() {
        const redirect_uri = encodeURIComponent(
            `https://deploy-preview-22--github-guru-server.netlify.app/api/callback`
        );
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}`;
        console.log("Redirecting to GitHub for login:", authUrl);
        chrome.tabs.create({ url: authUrl });
    }

    return (
        <>
            <Modal
                title="Login Required"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)} // Correctly placed here for the Modal
                footer={[
                    <Button
                        key="login"
                        type="primary"
                        onClick={loginWithGithub}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src="./images/logo-2.png"
                            alt="GitHub"
                            style={{ verticalAlign: "middle", marginRight: 12, width: 18 }}
                        />
                        Login with GitHub
                    </Button>,
                ]}
                width={350}
                centered={true}
            >
                <p>You must log in with GitHub to use this extension.</p>
            </Modal>

            {localStorage.getItem("accessToken") && (
                <div>
                    <h1>We have the access token</h1>
                    <button
                        onClick={() => {
                            localStorage.removeItem("accessToken");
                            setIsModalVisible(true);
                            setUserData({});
                        }}
                    >
                        Logout
                    </button>

                    <h3>Get User Data</h3>
                    <button onClick={getUserData}>Get User Data</button>
                    {Object.keys(userData).length !== 0 && (
                        <h4>Hello There, {userData.login}</h4>
                    )}
                </div>
            )}
        </>
    );
};

export default Login;
