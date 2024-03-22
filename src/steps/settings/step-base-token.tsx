/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button, TextInput } from 'frog';
import {
  CHAIN_MAP,
  LowerCaseChainNames,
  SdkSupportedChainIds,
  chainStringToId,
} from 'mint.club-v2-sdk';
import { colors } from '../../../constants/colors';
import { BackButton } from '../../common/Buttons';
import { COMMON_ACTIONS } from '../../common/config';

export function BaseTokenStep(chainname: LowerCaseChainNames) {
  const chainId = chainStringToId(chainname);
  const chain = CHAIN_MAP[chainId as SdkSupportedChainIds];

  return {
    title: 'Choose Base Token',
    image: (
      <div tw="flex flex-col items-center justify-center px-10 text-white">
        <div
          tw="mt-5 flex flex items-center text-6xl"
          style={{ color: colors.primary }}
        >
          🪙 Base Token
        </div>
        <div tw="mt-5 flex text-center">
          Enter the token address on{' '}
          <div tw="flex items-center">
            <img
              tw="mx-2"
              src={chain.icon}
              width={18}
              height={18}
              alt="chain"
            />{' '}
            <div
              tw="flex"
              style={{
                color: chain.color,
              }}
            >
              {chain.name} Chain
            </div>
          </div>{' '}
        </div>
        <div>that will be used for minting your NFT</div>

        <div tw="mb-5 mt-10 flex border-b-2 border-yellow-500 px-5 pb-2 text-center text-center text-yellow-500">
          Tip
        </div>
        <div tw="flex flex-wrap justify-center text-center text-xl text-gray-300">
          For example, if you enter the{' '}
          <span tw="mx-1" style={{ color: colors.twitter }}>
            $DEGEN
          </span>{' '}
          token address
          <br />
          people will be able to mint the NFT with{' '}
          <span tw="mx-1" style={{ color: colors.twitter }}>
            $DEGEN
          </span>{' '}
          tokens
        </div>
      </div>
    ),

    intents: [
      <TextInput placeholder="Token Address (0x...)" />,
      <BackButton />,
      <Button value={COMMON_ACTIONS.SET_BASE_TOKEN}>Continue</Button>,
    ],
  };
}
