import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

const prisma = new PrismaClient();
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      },
    });

    const token = jsonwebtoken.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jsonwebtoken.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
