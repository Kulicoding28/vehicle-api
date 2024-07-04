-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleBrand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pricelist" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "yearId" INTEGER NOT NULL,
    "modelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pricelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleYear" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleYear_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VehicleType" ADD CONSTRAINT "VehicleType_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "VehicleBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleModel" ADD CONSTRAINT "VehicleModel_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "VehicleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pricelist" ADD CONSTRAINT "Pricelist_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "VehicleYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pricelist" ADD CONSTRAINT "Pricelist_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
