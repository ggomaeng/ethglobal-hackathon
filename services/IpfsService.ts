import { SdkSupportedChainIds, mintclub } from 'mint.club-v2-sdk';
import fetch from 'node-fetch';
import { prisma } from '../database/prisma';
import { generateNextAvailableSymbol } from '../utils/symbol';
import { kebabCase } from 'lodash-es';
import { uploadMetadataToPinata, uploadToPinata } from './PinataService';

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
      const buffer = await (await fetch(url)).arrayBuffer();
      const blob = new File([buffer], 'image.png');
      const symbolFromName = kebabCase(collectionName);
      const creationFee = await mintclub.network(chainId).bond.getCreationFee();

      const { symbol } = await generateNextAvailableSymbol({
        chainId,
        symbol: symbolFromName,
        tokenType: 'ERC1155',
      });

      const imageHash = await uploadToPinata(blob);
      if (!imageHash) throw new Error('Image hash not found');
      console.log({ imageHash });

      const metadataHash = await uploadMetadataToPinata(
        imageHash as `ipfs://${string}`,
        collectionName,
      );

      console.log({ metadataHash });
      if (!metadataHash) throw new Error('Metadata hash not found');
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
      console.error(e);
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
