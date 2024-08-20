import express from "express";
import { getUsers, getUser, createUser, deleteUser, updateUser } from "../controllers/userController.js";
const router = express.Router();


router.get("/users/", getUsers);
router.get("/users/:id", getUser);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);


export default router;