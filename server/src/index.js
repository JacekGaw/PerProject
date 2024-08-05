import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import { testDbConnection } from './database/db.js';
testDbConnection();

const app = express();
app.use(bodyParser.json());
app.use(cors()); 

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.status(200).send("Connected to API");
  });

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});