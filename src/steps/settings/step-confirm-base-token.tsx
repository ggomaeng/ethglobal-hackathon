/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button } from 'frog';
import { colors } from '../../../constants/colors';
import { isFalse } from '../../../utils/logic';
import { BackButton, NextButton } from '../../common/Buttons';
import { COMMON_ACTIONS } from '../../common/config';

export function ConfirmBaseTokenStep(baseToken: {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}) {
  if (isFalse(baseToken)) {
    return {
      title: 'Base Token',
      image: (
        <div tw="flex flex-col items-center justify-center text-white">
          {`Something went wrong`}
        </div>
      ),
      intents: [<BackButton />],
    };
  }

  return {
    title: 'Confirm Base Token',
    image: (
      <div tw="flex flex-col items-center justify-center px-10 text-white">
        <div tw="flex text-lg text-gray-500">Name</div>
        <div tw="flex">{baseToken.name}</div>

        <div tw="mt-5 flex text-lg text-gray-500">Symbol</div>
        <div tw="flex">{baseToken.symbol}</div>

        <div tw="mt-5 flex text-lg text-gray-500">Decimals</div>
        <div tw="flex">{baseToken.decimals}</div>

        <div tw="mt-5 flex text-lg text-gray-500">Token Address</div>
        <div tw="flex text-lg" style={{ fontFamily: 'roboto' }}>
          {baseToken.address}
        </div>

        <div tw="mt-10 flex" style={{ color: colors.primary }}>
          Does this look correct?
        </div>
      </div>
    ),

    intents: [
      <BackButton />,
      <Button value={COMMON_ACTIONS.CONFIRM_BASE_TOKEN}>👍 Yes</Button>,
    ],
  };
}
