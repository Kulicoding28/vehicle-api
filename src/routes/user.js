import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.js";
import { authorizeAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", authorizeAdmin, updateUser);
router.delete("/:id", authorizeAdmin, deleteUser);

export default router;
