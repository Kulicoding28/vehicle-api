import { getPagination } from "../utils/pagination.js";
import { authorizeAdmin } from "../middleware/auth.js";
import prisma from "../model/index.js";

export const getAllVehicles = async (req, res) => {
  const { page, size, brand_id } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const condition = brand_id ? { brandId: parseInt(brand_id) } : {};
    const vehicles = await prisma.vehicleModel.findMany({
      where: condition,
      skip: offset,
      take: limit,
    });
    const total = await prisma.vehicleModel.count({ where: condition });
    res.json({ total, vehicles });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getVehicleById = async (req, res) => {
  const { id } = req.params;
  try {
    const vehicle = await prisma.vehicleModel.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createVehicle = async (req, res) => {
  const { name, typeId, userId } = req.body;
  try {
    const vehicle = await prisma.vehicleModel.create({
      data: {
        name,
        typeId,
        userId,
      },
    });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { name, typeId } = req.body;
  try {
    const vehicle = await prisma.vehicleModel.update({
      where: { id: parseInt(id) },
      data: { name, typeId },
    });
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const vehicle = await prisma.vehicleModel.delete({
      where: { id: parseInt(id) },
    });
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
