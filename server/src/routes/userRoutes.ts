import express from "express";
import {
  getUsers,
  getUser,
  getUserInfo,
  createUser,
  deleteUser,
  updateUser,
  addUserToCompany,
  getUserBookmarks,
  changeUserPassword
} from "../controllers/userController.js";
const router = express.Router();

router.get("/users/", getUsers);
router.get("/users/:id", getUser);
router.get("/user/:id/info", getUserInfo);
router.get("/user/:id/bookmarks", getUserBookmarks);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.patch("/users/:id/change-password", changeUserPassword);
router.delete("/users/:id", deleteUser);
router.post("/users/:id/assign-company", addUserToCompany)

export default router;
