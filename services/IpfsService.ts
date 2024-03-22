'use server';
import { SdkSupportedChainIds, mintclub } from 'mint.club-v2-sdk';
import fetch from 'node-fetch';
import { prisma } from '../database/prisma';
import { FILEBASE_API_KEY } from './server-env';
import { generateNextAvailableSymbol } from '../utils/symbol';
import { kebabCase } from 'lodash-es';

export async function uploadToIpfs(params: {
  url: string;
  collectionName: string;
  chainId: SdkSupportedChainIds;
}) {
  const { chainId, url, collectionName } = params;
  const status = await prisma.ipfsStatus.create({ data: {} });

  async function upload() {
    console.log('uploading to ipfs & other metadata');
    try {
      const blob = await (await fetch(url)).blob();
      const symbolFromName = kebabCase(collectionName);
      const creationFee = await mintclub.network(chainId).bond.getCreationFee();

      const { symbol } = await generateNextAvailableSymbol({
        chainId,
        symbol: symbolFromName,
        tokenType: 'ERC1155',
      });

      const imageHash = await mintclub.ipfs.upload({
        filebaseApiKey: FILEBASE_API_KEY,
        media: blob,
      });
      console.log({ imageHash });

      const metadataHash = await mintclub.ipfs.uploadMetadata({
        filebaseApiKey: FILEBASE_API_KEY,
        image: imageHash as `ipfs://${string}`,
        name: collectionName,
      });

      console.log({ metadataHash });
      await prisma.ipfsStatus.update({
        where: {
          id: status.id,
        },
        data: {
          status: 'SUCCESS',
          ipfsHash: metadataHash,
          nftSymbol: symbol,
          creationFee: creationFee.toString(),
        },
      });
    } catch (e) {
      await prisma.ipfsStatus.update({
        where: {
          id: status.id,
        },
        data: {
          status: 'FAILED',
        },
      });
    }
  }

  upload();

  return status;
}

export async function getStatus(statusId: number) {
  return prisma.ipfsStatus.findUnique({
    where: {
      id: statusId,
    },
  });
}
