-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "staffCount" INTEGER NOT NULL,
    "region" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyPlan" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "gsm" DOUBLE PRECISION NOT NULL,
    "gadgets" DOUBLE PRECISION NOT NULL,
    "digital" DOUBLE PRECISION NOT NULL,
    "orders" DOUBLE PRECISION NOT NULL,
    "household" DOUBLE PRECISION NOT NULL,
    "tech" DOUBLE PRECISION NOT NULL,
    "photo" DOUBLE PRECISION NOT NULL,
    "sp" DOUBLE PRECISION NOT NULL,
    "service" DOUBLE PRECISION NOT NULL,
    "smart" DOUBLE PRECISION NOT NULL,
    "sim" DOUBLE PRECISION NOT NULL,
    "skill" DOUBLE PRECISION NOT NULL,
    "click" DOUBLE PRECISION NOT NULL,
    "vp" DOUBLE PRECISION NOT NULL,
    "nayavu" DOUBLE PRECISION NOT NULL,
    "spice" DOUBLE PRECISION NOT NULL,
    "auto" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_number_key" ON "Store"("number");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyPlan_storeId_month_key" ON "MonthlyPlan"("storeId", "month");

-- AddForeignKey
ALTER TABLE "MonthlyPlan" ADD CONSTRAINT "MonthlyPlan_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
