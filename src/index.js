import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import vehicleRoutes from "./routes/vehicle.js";
import { authenticateToken } from "./middleware/auth.js";
import { PORT } from "./config/constant.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", authenticateToken, userRoutes);
app.use("/vehicles", authenticateToken, vehicleRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
