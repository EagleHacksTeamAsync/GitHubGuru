import React, { useEffect, useState } from "react";
import modal from "antd/lib/modal";

const CLIENT_ID = "ae74d81ecc346767a9bc";

const Login = () => {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParams = urlParams.get("code");
    console.log(codeParams);

    if (codeParams && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch(
          //"https://github-guru-server.netlify.app/getAccessToken?code=${codeParams}",
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
      //"https://github-guru-server.netlify.app/getUserData",
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
    console.log("Attempting to redirect to GitHub for login.");

    chrome.tabs.create({
      url: `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        "https://github-guru-server.netlify.app/auth/github/callback"
      )}`,
    });
  }

  return (
    <div>
      {localStorage.getItem("accessToken") ? (
        <>
          <h1>We have the access token</h1>
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              setRerender(!rerender);
            }}
          >
            Logout
          </button>

          <h3>Get User Data</h3>
          <button onClick={getUserData}>Get User Data</button>
          {Object.keys(userData).length !== 0 && (
            <h4>Hello There, {userData.login}</h4>
          )}
        </>
      ) : (
        <>
          <h1>User is not logged in</h1>
          <button onClick={loginWithGithub}>Login with Github</button>
        </>
      )}
    </div>
  );
};

export default Login;
