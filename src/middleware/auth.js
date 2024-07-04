import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constant.js";

export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

export const authorizeAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ error: "Only admin users are authorized for this operation" });
  }
  next();
};
