// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();
const router = Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

router.get("/hello", (req, res) => res.send("Hello World!"));

router.get("/callback", async (req, res) => {
    const { code } = req.query;

    router.post('https://github.com/login/oauth/access_token')
        .send({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code
        })
        .set('Accept', 'application/json')
        .then((response) => {
            res.json(response.body);
        })
        .catch((error) => {
            res.send(error);
        });

    res.send("You've been logged in successfully!");
});

router.get("/getUserData", async (req, res) => {
    req.get("Authorization");
    
    req.get('https://api.github.com/user')
        .set('Authorization', `token ${accessToken}`)
        .then((response) => {
            res.json(response.body);
        })
        .catch((error) => {
            res.send(error);
        });
});

api.use("/api/", router);

export const handler = serverless(api);
