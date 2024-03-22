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
} from 'valibot';
import { stringToNumber } from '../helpers/schemaHelper';

export const ERC20Schema = object(
  {
    chain: picklist(CHAINS.map((chain) => chainIdToString(chain.id))),
    curveType: picklist(['LINEAR', 'EXPONENTIAL', 'LOGARITHMIC', 'FLAT']),
    royalty: stringToNumber('Royalty should be a number'),
    name: string('Name should be a string', [
      minLength(1, 'Name should be at least 1 character long'),
      maxLength(50, 'Name should be at most 50 characters long'),
    ]),
    symbol: string('Symbol should be a string', [
      minLength(1, 'Symbol should be at least 1 character long'),
      maxLength(15, 'Symbol should be at most 15 characters long'),
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
