import { CHAINS, chainIdToString } from 'mint.club-v2-sdk';
import {
  length,
  maxLength,
  minLength,
  minValue,
  number,
  object,
  picklist,
  startsWith,
  string,
  url,
  value,
} from 'valibot';
import { stringToNumber } from '../helpers/schemaHelper';

export const Community1155Schema = object({
  chain: picklist(CHAINS.map((chain) => chainIdToString(chain.id))),
  curveType: picklist(['LINEAR', 'EXPONENTIAL', 'LOGARITHMIC', 'FLAT']),
  royalty: stringToNumber('Royalty should be a number'),
  ipfsStatus: object({
    ipfsHash: string('IPFS hash should be a string'),
    status: string('Status should be a string', [value('SUCCESS')]),
  }),
  imageUrl: string([url('imageURL should be a valid URL')]),
  collectionName: string('Collection name should be a string', [
    minLength(1, 'Name should be at least 1 character long'),
    maxLength(50, 'Name should be at most 50 characters long'),
  ]),
  maxSupply: stringToNumber('Max supply should be a number', [
    minValue(1, 'Minimum value for maxSupply is 1'),
  ]),
  baseToken: object({
    decimals: number('Decimals should be a number', [
      minValue(0, 'Minimum value for decimals is 0'),
    ]),
    symbol: string('Symbol should be a string'),
    address: string('Base token address should be a string', [
      length(42, 'Base token address should be 42 characters long'),
      startsWith('0x', 'Base token address should start with 0x'),
    ]),
  }),
  price: stringToNumber('Price should be a number'),
});
