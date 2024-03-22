'use server';
import { prisma } from '../database/prisma';
import { FILEBASE_API_KEY } from './server-env';
import { FilebaseClient } from '@filebase/client';
import fetch from 'node-fetch';

const client = new FilebaseClient({ token: FILEBASE_API_KEY });

export async function uploadToIpfs(url: string) {
  const status = await prisma.ipfsStatus.create({ data: {} });

  async function upload() {
    console.log('uploading to ipfs');
    try {
      const arrayBuffer = await (await fetch(url)).arrayBuffer();
      const blob = new Blob([arrayBuffer]);
      const cid = await client.storeBlob(blob);
      await prisma.ipfsStatus.update({
        where: {
          id: status.id,
        },
        data: {
          status: 'SUCCESS',
          ipfsHash: cid,
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
