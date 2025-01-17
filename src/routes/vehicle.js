import express from "express";
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.js";
import { authenticateToken, authorizeAdmin } from "../middleware/auth.js";
import { getVehicleFilter } from "../controllers/vehicleFilter.js";

const router = express.Router();

router.get("/", authenticateToken, getAllVehicles);
router.get("/vehicle-types", authenticateToken, getVehicleFilter);
router.get("/:id", authenticateToken, getVehicleById);
router.post("/", authenticateToken, authorizeAdmin, createVehicle);
router.patch("/:id", authenticateToken, authorizeAdmin, updateVehicle);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteVehicle);

export default router;
