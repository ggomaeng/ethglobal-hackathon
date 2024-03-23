import fetch from 'node-fetch';
import { PINATA_API_JWT } from './server-env';

export async function uploadToPinata(blob: Blob) {
  const data = new FormData();
  data.append('file', blob);

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_API_JWT}`,
    },
    body: data,
  });

  const { IpfsHash } = (await res.json()) as {
    IpfsHash: string;
  };
  return `ipfs://${IpfsHash}`;
}

export async function uploadMetadataToPinata(
  imageHash: `ipfs://${string}`,
  name: string,
) {
  const defaultExternalLink = `https://mint.club`;
  const defaultDescription = [
    `A Bonding Curved ERC-1155 token powered by mint.club bonding curve protocol.`,
    defaultExternalLink,
  ].join('\n\n');

  const finalMetadata = {
    name,
    description: defaultDescription,
    image: imageHash,
    external_url: defaultExternalLink,
    attributes: [],
  };

  const metadata = JSON.stringify(finalMetadata);
  const metadataBuffer = new File([metadata], 'metadata.json', {
    type: 'application/json',
  });
  return uploadToPinata(metadataBuffer);
}
