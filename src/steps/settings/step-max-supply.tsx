/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { BackButton } from '../../common/Buttons';
import { COMMON_ACTIONS } from '../../common/config';
import { Button, TextInput } from 'frog';

export const MaxSupplyStep = {
  title: 'Max Supply',
  image: (
    <div tw=" flex flex-col items-center justify-center p-10 text-white">
      <div tw="text-4xl">#️⃣</div>
      <div tw="mt-5 flex text-center text-3xl">
        What is the maximum supply of your NFT Collection?
      </div>
      <div tw="mt-10 flex flex-col items-center px-10 text-center text-xl text-gray-500">
        <div tw="mb-5 flex border-b-2 border-yellow-300 px-5 pb-2 text-center text-yellow-300">
          Tip
        </div>
        <div tw="flex text-center text-lg">
          It is the maximum number of NFTs that can be minted in the collection
        </div>
        <div tw="flex text-center text-lg">e.g. 10,000</div>
      </div>
    </div>
  ),

  intents: [
    <BackButton />,
    <TextInput placeholder="e.g. 10,000" />,
    <Button value={COMMON_ACTIONS.SET_MAX_SUPPLY}>Continue</Button>,
  ],
};
