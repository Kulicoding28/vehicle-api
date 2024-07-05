import { getPagination } from "../utils/pagination.js";
import { authenticateToken } from "../middleware/auth.js";
import prisma from "../model/index.js";

export const getAllVehicles = async (req, res) => {
  const { page, size, brand_id } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const condition = brand_id ? { brandId: parseInt(brand_id) } : {};
    const vehicles = await prisma.vehicleModel.findMany({
      where: condition,
      include: {
        pricelists: {
          include: {
            year: true,
          },
        },
        type: {
          include: {
            brand: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });

    const formattedVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
      vehicleBrandName: vehicle.type.brand.name,
      vehicleTypeName: vehicle.type.name,
      vehicleModelName: vehicle.name,
      priceList: vehicle.priceLists.map((priceList) => ({
        price: priceList.price,
        vehicleYear: priceList.year.year,
      })),
    }));
    const total = await prisma.vehicleModel.count({ where: condition });
    res.json({ total, vehicles: formattedVehicles });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getVehicleById = async (req, res) => {
  const { id } = req.params;
  try {
    const vehicle = await prisma.vehicleModel.findUnique({
      where: { id: parseInt(id) },
      include: {
        priceLists: {
          include: {
            year: true,
          },
        },
        type: {
          include: {
            brand: true,
          },
        },
      },
    });
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const formattedVehicle = {
      id: vehicle.id,
      name: vehicle.name,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
      vehicleBrandName: vehicle.type.brand.name,
      vehicleTypeName: vehicle.type.name,
      vehicleModelName: vehicle.name,
      priceList: vehicle.priceLists.map((priceList) => ({
        price: priceList.price,
        vehicleYear: priceList.year.year,
      })),
    };
    res.json(formattedVehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createVehicle = async (req, res) => {
  const { brandName, typeName, modelName, userId, price, year } = req.body;

  try {
    // Verifikasi apakah userId ada
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Temukan atau buat brand kendaraan
    let vehicleBrand = await prisma.vehicleBrand.findFirst({
      where: { name: brandName },
    });

    if (!vehicleBrand) {
      vehicleBrand = await prisma.vehicleBrand.create({
        data: { name: brandName },
      });
    }

    // Temukan atau buat tipe kendaraan
    let vehicleType = await prisma.vehicleType.findFirst({
      where: {
        name: typeName,
        brandId: vehicleBrand.id,
      },
    });

    if (!vehicleType) {
      vehicleType = await prisma.vehicleType.create({
        data: {
          name: typeName,
          brandId: vehicleBrand.id,
        },
      });
    }

    // Temukan atau buat tahun kendaraan
    let vehicleYear = await prisma.vehicleYear.findFirst({
      where: { year },
    });

    if (!vehicleYear) {
      vehicleYear = await prisma.vehicleYear.create({
        data: { year },
      });
    }

    // Buat model kendaraan baru
    const vehicle = await prisma.vehicleModel.create({
      data: {
        name: modelName,
        typeId: vehicleType.id,
        userId: user.id,
        priceLists: {
          create: {
            price: price,
            yearId: vehicleYear.id,
          },
        },
      },
      include: {
        priceLists: {
          include: {
            year: true,
          },
        },
        type: {
          include: {
            brand: true,
          },
        },
        user: true,
      },
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { vehicleBrandName, vehicleTypeName, vehicleModelName, priceList } =
    req.body;

  try {
    const vehicleBrand = await prisma.vehicleBrand.findFirst({
      where: { name: vehicleBrandName },
    });

    if (!vehicleBrand) {
      return res.status(400).json({ error: "Brand not found" });
    }

    const vehicleType = await prisma.vehicleType.findFirst({
      where: {
        name: vehicleTypeName,
        brandId: vehicleBrand.id,
      },
    });

    if (!vehicleType) {
      return res
        .status(400)
        .json({ error: "Type not found for the given brand" });
    }

    const vehicle = await prisma.vehicleModel.update({
      where: { id: parseInt(id) },
      data: {
        name: vehicleModelName,
        typeId: vehicleType.id,
      },
      include: {
        type: {
          include: {
            brand: true,
          },
        },
        priceLists: {
          include: {
            year: true,
          },
        },
      },
    });

    // Update price lists if provided
    if (priceList && priceList.length > 0) {
      for (const price of priceList) {
        const vehicleYear = await prisma.vehicleYear.findFirst({
          where: { year: price.vehicleYear },
        });

        if (!vehicleYear) {
          return res.status(400).json({ error: "Year not found" });
        }

        await prisma.priceList.updateMany({
          where: {
            modelId: vehicle.id,
            yearId: vehicleYear.id,
          },
          data: { price: price.price },
        });
      }
    }

    const formattedVehicle = {
      id: vehicle.id,
      name: vehicle.name,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
      vehicleBrandName: vehicle.type.brand.name,
      vehicleTypeName: vehicle.type.name,
      vehicleModelName: vehicle.name,
      priceList: vehicle.priceLists.map((priceList) => ({
        price: priceList.price,
        vehicleYear: priceList.year.year,
      })),
    };

    res.json(formattedVehicle);
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
