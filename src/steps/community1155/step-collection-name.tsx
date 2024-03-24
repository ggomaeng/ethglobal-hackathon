/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button, TextInput } from 'frog';
import { BackButton } from '../../common/Buttons';
import { COMMON_ACTIONS } from '../../common/config';
import { Community1155StepParams } from '../../community-1155';

export function ERC1155CollectionNameStep({
  extraParams,
}: Community1155StepParams) {
  const { baseToken } = extraParams;

  const symbol = baseToken?.symbol || '';

  return {
    title: 'Collection Name',
    image: (
      <div tw=" flex flex-col items-center justify-center p-10 text-white">
        <div tw="text-4xl">🖼️</div>
        <div tw="mt-5 flex text-center text-3xl">
          What is the name of your NFT Collection?
        </div>
        <div tw="mt-10 flex flex-col items-center px-10 text-center text-xl text-gray-500">
          <div tw="mb-5 flex border-b-2 border-yellow-300 px-5 pb-2 text-center text-yellow-300">
            Tip
          </div>
          <div tw="flex text-center text-lg">
            {symbol} Yacht Club, {symbol}Punks, etc.
          </div>
        </div>
      </div>
    ),

    intents: [
      <TextInput placeholder="Collection Name" />,
      <BackButton />,
      <Button value={COMMON_ACTIONS.SET_NAME}>Continue</Button>,
    ],
  };
}
