/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { BackButton } from '../../common/Buttons';
import { COMMON_ACTIONS, NFT_ACTIONS } from '../../common/config';
import { colors } from '../../../constants/colors';
import { Button, TextInput } from 'frog';

export const StepCountsStep = {
  title: 'Step Counts',
  image: (
    <div tw="flex flex-col items-center justify-center px-5 text-white">
      <div tw="flex text-white">
        How many steps would you like to have for the bonding curve?
      </div>

      <div tw="mt-10 flex flex-col items-center px-10 text-center text-xl">
        <div tw="mb-5 flex border-b-2 border-yellow-300 px-5 pb-2 text-center text-yellow-300">
          Tip
        </div>
        <div tw="mb-5 flex text-lg text-gray-500">For example</div>
        <div tw="flex flex-wrap justify-center text-center">
          If you have{' '}
          <span
            tw="mx-1"
            style={{
              color: colors.primary,
            }}
          >
            max supply
          </span>
          of{' '}
          <span
            tw="mx-1"
            style={{
              color: colors.primary,
            }}
          >
            100
          </span>{' '}
          and
          <span
            tw="mx-1"
            style={{
              color: colors.primary,
            }}
          >
            10 step counts
          </span>
        </div>

        <div tw="mt-5 flex flex-wrap justify-center">
          the bonding curve would have{' '}
          <span
            tw="mx-1"
            style={{
              color: colors.primary,
            }}
          >
            10 mintable NFT
          </span>{' '}
          on each step
        </div>
        <div tw="mt-5 flex flex-wrap justify-center">
          The price of the NFT would{' '}
          <span
            tw="mx-1"
            style={{
              color: colors.primary,
            }}
          >
            increase
          </span>{' '}
          when each step is fully minted
        </div>
      </div>
    </div>
  ),

  intents: [
    <BackButton />,
    <TextInput placeholder="min 2 steps, max 100 steps" />,
    <Button value={COMMON_ACTIONS.SET_STEP_COUNT}>Continue</Button>,
  ],
};
