import { stringToNumber } from '../helpers/schemaHelper';
import { CHAINS, chainIdToString } from 'mint.club-v2-sdk';
import {
  custom,
  forward,
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

export const ERC1155Schema = object(
  {
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
    creatorAllocation: stringToNumber('Creator allocation should be a number'),
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
    initialPrice: stringToNumber('Initial price should be a number'),
    finalPrice: stringToNumber('Final price should be a number'),
  },
  [
    forward(
      custom((input) => {
        if (input.maxSupply < input.creatorAllocation) {
          return false;
        }
        return true;
      }, 'Max supply should be greater than or equal to creator allocation'),
      ['creatorAllocation'],
    ),
    forward(
      custom((input) => {
        if (input.finalPrice < input.initialPrice) {
          return false;
        }
        return true;
      }, 'Final price should be greater than or equal to initial price'),
      ['finalPrice'],
    ),
  ],
);
