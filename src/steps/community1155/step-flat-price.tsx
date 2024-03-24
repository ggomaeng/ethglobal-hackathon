/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button, TextInput } from 'frog';
import { colors } from '../../../constants/colors';
import { BackButton } from '../../common/Buttons';
import { COMMON_ACTIONS } from '../../common/config';
import { Community1155StepParams } from '../../community-1155';

export function FlatPriceStep({ state }: Community1155StepParams) {
  const { baseToken } = state;

  return {
    title: 'Mint Price',
    image: (
      <div tw="flex flex-col items-center justify-center px-10 text-white">
        <div tw="text-4xl">🪙</div>
        <div tw="mt-5 flex text-center text-3xl">
          What is the{' '}
          <span
            tw="mx-2"
            style={{
              color: colors.primary,
            }}
          >
            minting price
          </span>{' '}
          for the NFT?
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
            the NFT minting price would be{' '}
            <span
              tw="mx-1"
              style={{
                color: colors.twitter,
              }}
            >
              10 ${baseToken?.symbol}
            </span>{' '}
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
}
