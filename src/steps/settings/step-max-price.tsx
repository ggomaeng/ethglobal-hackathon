/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { BackButton } from '../../common/Buttons';
import { COMMON_ACTIONS } from '../../common/config';
import { colors } from '../../../constants/colors';
import { Button, TextInput } from 'frog';

export const FinalPriceStep = {
  title: 'Final Price',
  image: (
    <div tw="flex flex-col items-center justify-center px-10 text-white">
      <div tw="text-4xl">📈</div>
      <div tw="mt-5 flex text-center text-3xl">
        What is the{' '}
        <span
          tw="mx-2"
          style={{
            color: colors.primary,
          }}
        >
          maximum
        </span>{' '}
        minting price for the NFT?
      </div>

      <div tw="mt-10 flex flex-col items-center px-10 text-center text-xl">
        <div tw="mb-5 flex border-b-2 border-yellow-300 px-5 pb-2 text-center text-yellow-300">
          Tip
        </div>
        <div tw="flex text-center text-lg">
          If you put{' '}
          <span
            tw="mx-1"
            style={{
              color: colors.twitter,
            }}
          >
            10
          </span>{' '}
          and the base token is set as{' '}
          <span
            tw="mx-1"
            style={{
              color: colors.twitter,
            }}
          >
            $DEGEN
          </span>
        </div>
        <div tw="flex text-center text-lg">
          the final NFT price would be{' '}
          <span
            tw="mx-1"
            style={{
              color: colors.twitter,
            }}
          >
            10 $DEGEN
          </span>{' '}
          when the collection is fully minted
        </div>
        <div tw="flex text-center text-lg">
          This is also the final price step for the bonding curve
        </div>
      </div>
    </div>
  ),

  intents: [
    <BackButton />,
    <TextInput placeholder="e.g. 1" />,
    <Button value={COMMON_ACTIONS.SET_FINAL_PRICE}>Continue</Button>,
  ],
};
