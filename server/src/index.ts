import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { runDB } from "./database/db.js";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import authRouter from "./routes/authRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import companyRouter from "./routes/companyRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import sprintRouter from "./routes/sprintRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

runDB();

const app = express();
const corsOptions = {
  origin: [
      "http://localhost:8088",
      "http://localhost:5173",
      "https://devperpro.bieda.it"
  ],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'nonce-randomvalue';"
  );
  next();
});

// const corsOptions = {
//   origin: ["http://localhost:8088", "http://localhost:5173", "https://devperpro.bieda.it", "http://frontend:8088"],
//   methods: ["GET", "POST", "PATCH", "DELETE"],
//   // allowedHeaders: ["Content-Type", "Authorization"],
//   credentials:true
// };





const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).send("Connected to API");
});

app.use(errorHandler);

app.use("/api/", userRouter);
app.use("/api/", projectRouter);
app.use("/auth/", authRouter);
app.use("/api/", companyRouter);
app.use("/api/", taskRouter);
app.use("/api/", sprintRouter);
app.use("/api/dashboard/", dashboardRouter);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});

export default app;
