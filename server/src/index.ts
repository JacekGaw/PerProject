import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { runDB } from './database/db.js';
runDB();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.status(200).send("Connected to API");
  });

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});