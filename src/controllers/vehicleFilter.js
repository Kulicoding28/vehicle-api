import prisma from "../model/index.js";

// Handler untuk mendapatkan semua vehicle types berdasarkan brand_id
export const getVehicleFilter = async (req, res) => {
  const { brand_id } = req.query;
  if (!brand_id) {
    return res.status(400).json({ error: "brand_id is required" });
  }

  try {
    const vehicleTypes = await prisma.vehicleType.findMany({
      where: {
        brandId: parseInt(brand_id, 10),
      },
      select: {
        name: true,
      },
    });

    res.status(200).json(vehicleTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
