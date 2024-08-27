import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { runDB } from "./database/db.js";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import authRouter from "./routes/authRoutes.js";
import companyRouter from "./routes/companyRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js";
runDB();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).send("Connected to API");
});

app.use(errorHandler);

app.use("/api/", userRouter);
app.use("/api/", projectRouter);
app.use("/auth/", authRouter);
app.use("/api/", projectRouter);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
