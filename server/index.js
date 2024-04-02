import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import admin from "firebase-admin";

// Create express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes

// Port server is listening on
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
  console.error(err.stack);
});

export default app;
