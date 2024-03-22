/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { BackButton } from '../../common/Buttons';
import { COMMON_ACTIONS } from '../../common/config';
import { colors } from '../../../constants/colors';
import { Button, TextInput } from 'frog';

export const CreatorAllocationStep = {
  title: 'Creator Allocation',
  image: (
    <div tw="flex flex-col items-center justify-center px-10 text-white">
      <div tw="flex text-white">
        How many free NFTs would you like to allocate to the deployer?
      </div>

      <div tw="mt-10 flex flex-col items-center px-10 text-center text-xl text-gray-500">
        <div tw="mb-5 flex border-b-2 border-yellow-300 px-5 pb-2 text-center text-yellow-300">
          Tip
        </div>
        <div tw="flex text-center">
          This would be allocated to
          <span
            tw="mx-1"
            style={{
              color: colors.primary,
            }}
          >
            you
          </span>
        </div>
        <div>which you can use for the ecosystem, giveaways, etc.</div>
      </div>
    </div>
  ),

  intents: [
    <BackButton />,
    <TextInput placeholder="e.g. 10,000" />,
    <Button value={COMMON_ACTIONS.SET_CREATOR_ALLOCATION}>Continue</Button>,
  ],
};
