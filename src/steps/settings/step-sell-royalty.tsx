/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { BackButton } from '../../common/Buttons';
import { COMMON_ACTIONS } from '../../common/config';
import { colors } from '../../../constants/colors';
import { Button, TextInput } from 'frog';

export const SellRoyaltyStep = {
  title: 'Sell Royalty',
  image: (
    <div tw="flex flex-col items-center justify-center px-10 text-white">
      <div
        tw="flex items-center justify-center text-center"
        style={{ color: colors.white }}
      >
        How much sell royalty percentage would you like to set?
      </div>
      <div tw="mt-10 flex flex-col items-center px-10 text-center text-xl text-gray-500">
        <div tw="mb-5 flex border-b-2 border-yellow-300 px-5 pb-2 text-center text-yellow-300">
          Tip
        </div>
        <div tw="flex text-center text-lg">
          The royalty of every trade on the bonding curve is given to the
          deployer
        </div>

        <div tw="flex text-center text-lg">
          The value should be between{' '}
          <span
            tw="mx-1"
            style={{
              color: colors.primary,
            }}
          >
            0
          </span>{' '}
          and{' '}
          <span
            tw="mx-1"
            style={{
              color: colors.primary,
            }}
          >
            50
          </span>
          in percentage
        </div>

        <div tw="flex text-center text-lg">
          The royalty is distributed{' '}
          <span
            tw="mx-1"
            style={{
              color: colors.primary,
            }}
          >
            8:2
          </span>{' '}
          between the deployer and the protocol
        </div>
      </div>
    </div>
  ),

  intents: [
    <BackButton />,
    <TextInput placeholder="(Optional) default is 0.3%" />,
    <Button value={COMMON_ACTIONS.SET_SELL_ROYALTY}>Continue</Button>,
  ],
};
