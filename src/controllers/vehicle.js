import prisma from "../model/index.js";

export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicleModel.findMany({
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

    res.status(200).json(formattedVehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  const { brandName, typeName, modelName, priceList } = req.body;

  try {
    // Cek keberadaan vehicle berdasarkan ID
    const existingVehicle = await prisma.vehicleModel.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Temukan atau buat brand kendaraan
    let vehicleBrand = await prisma.vehicleBrand.findFirst({
      where: { name: brandName },
    });

    if (!vehicleBrand) {
      return res.status(400).json({ error: "Brand not found" });
    }

    // Temukan atau buat tipe kendaraan
    let vehicleType = await prisma.vehicleType.findFirst({
      where: {
        name: typeName,
        brandId: vehicleBrand.id,
      },
    });

    if (!vehicleType) {
      return res
        .status(400)
        .json({ error: "Type not found for the given brand" });
    }

    // Update model kendaraan
    const vehicle = await prisma.vehicleModel.update({
      where: { id: parseInt(id) },
      data: {
        name: modelName,
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
        let vehicleYear = await prisma.vehicleYear.findFirst({
          where: { year: price.vehicleYear },
        });

        if (!vehicleYear) {
          vehicleYear = await prisma.vehicleYear.create({
            data: { year: price.vehicleYear },
          });
        }

        await prisma.priceList.upsert({
          where: {
            modelId_yearId: {
              modelId: vehicle.id,
              yearId: vehicleYear.id,
            },
          },
          update: {
            price: price.price,
          },
          create: {
            price: price.price,
            yearId: vehicleYear.id,
            modelId: vehicle.id,
          },
        });
      }
    }

    // Format response
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
    await prisma.priceList.deleteMany({
      where: { modelId: parseInt(id) },
    });

    await prisma.vehicleModel.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Vehicle successfully removed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
