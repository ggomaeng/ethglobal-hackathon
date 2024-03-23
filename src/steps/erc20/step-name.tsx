/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button, TextInput } from 'frog';
import { BackButton } from '../../common/Buttons';
import { COMMON_ACTIONS } from '../../common/config';
import { colors } from '../../../constants/colors';

export const ERC20NameStep = {
  title: 'Token Name',
  image: (
    <div tw=" flex flex-col items-center justify-center p-10 text-white">
      <div tw="text-4xl">🪙</div>
      <div tw="mt-5 flex text-center text-3xl">
        What is the{' '}
        <span tw="mx-1" style={{ color: colors.primary }}>
          name
        </span>{' '}
        of your token?
      </div>
      <div tw="mt-10 flex flex-col items-center px-10 text-center text-xl text-gray-500">
        <div tw="mb-5 flex border-b-2 border-yellow-300 px-5 pb-2 text-center text-yellow-300">
          Tip
        </div>
        <div tw="flex text-center text-lg">
          DEGEN (Base), Ethereum, Dogecoin, etc.
        </div>
      </div>
    </div>
  ),

  intents: [
    <TextInput placeholder="Token Name, e.g. Ethereum" />,
    <BackButton />,
    <Button value={COMMON_ACTIONS.SET_NAME}>Continue</Button>,
  ],
};
