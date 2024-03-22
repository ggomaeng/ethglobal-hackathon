-- CreateEnum
CREATE TYPE "NFTCollectionType" AS ENUM ('COLLECTION', 'DERIVATIVE');

-- CreateEnum
CREATE TYPE "CurveType" AS ENUM ('LINEAR', 'EXPONENTIAL', 'LOGARITHMIC', 'FLAT');

-- CreateEnum
CREATE TYPE "IpfsStatusType" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "IpfsStatus" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipfsHash" TEXT,
    "status" "IpfsStatusType" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "IpfsStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chainId" INTEGER NOT NULL,
    "frameName" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "creatorId" INTEGER,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFT" (
    "id" SERIAL NOT NULL,
    "collectionType" "NFTCollectionType" NOT NULL,
    "chainId" INTEGER NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "frameName" TEXT NOT NULL,
    "baseTokenChainId" INTEGER,
    "baseTokenAddress" TEXT,
    "farcasterUserFid" INTEGER,
    "curveDataId" INTEGER,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaseToken" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chainId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "BaseToken_pkey" PRIMARY KEY ("chainId","address")
);

-- CreateTable
CREATE TABLE "DerivativeImageData" (
    "id" SERIAL NOT NULL,
    "svgUrl" TEXT NOT NULL,
    "colors" TEXT[],
    "nftId" INTEGER NOT NULL,

    CONSTRAINT "DerivativeImageData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurveData" (
    "id" SERIAL NOT NULL,
    "curveType" "CurveType" NOT NULL,
    "stepCount" INTEGER NOT NULL,
    "initialPrice" DOUBLE PRECISION NOT NULL,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "maxSupply" INTEGER NOT NULL,
    "creatorAllocation" INTEGER NOT NULL DEFAULT 0,
    "buyRoyalty" INTEGER NOT NULL DEFAULT 3,
    "sellRoyalty" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "CurveData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarcasterUser" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fid" INTEGER NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "FarcasterUser_pkey" PRIMARY KEY ("fid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_frameName_key" ON "Token"("frameName");

-- CreateIndex
CREATE UNIQUE INDEX "Token_chainId_tokenAddress_key" ON "Token"("chainId", "tokenAddress");

-- CreateIndex
CREATE UNIQUE INDEX "NFT_frameName_key" ON "NFT"("frameName");

-- CreateIndex
CREATE UNIQUE INDEX "NFT_curveDataId_key" ON "NFT"("curveDataId");

-- CreateIndex
CREATE INDEX "NFT_collectionType_chainId_idx" ON "NFT"("collectionType", "chainId");

-- CreateIndex
CREATE INDEX "NFT_chainId_tokenAddress_idx" ON "NFT"("chainId", "tokenAddress");

-- CreateIndex
CREATE UNIQUE INDEX "NFT_collectionType_chainId_frameName_key" ON "NFT"("collectionType", "chainId", "frameName");

-- CreateIndex
CREATE UNIQUE INDEX "DerivativeImageData_nftId_key" ON "DerivativeImageData"("nftId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "FarcasterUser"("fid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_farcasterUserFid_fkey" FOREIGN KEY ("farcasterUserFid") REFERENCES "FarcasterUser"("fid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_curveDataId_fkey" FOREIGN KEY ("curveDataId") REFERENCES "CurveData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_baseTokenChainId_baseTokenAddress_fkey" FOREIGN KEY ("baseTokenChainId", "baseTokenAddress") REFERENCES "BaseToken"("chainId", "address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DerivativeImageData" ADD CONSTRAINT "DerivativeImageData_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "NFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
