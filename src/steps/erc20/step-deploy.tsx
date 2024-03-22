/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button } from 'frog';
import {
  CHAIN_MAP,
  chainStringToId,
  commify,
  shortenNumber,
} from 'mint.club-v2-sdk';
import { colors } from '../../../constants/colors';
import { COMMON_ROUTES, NFT_ACTIONS } from '../../common/config';
import { ERC20StepParams } from '../../create-erc20';
import { NAVIGATE } from '../../navigators/baseFrameNavigator';

export function ERC20DeployStep({ state }: ERC20StepParams) {
  const {
    chain,
    curveType,
    baseToken,
    creatorAllocation,
    name,
    symbol,
    finalPrice,
    initialPrice,
    maxSupply,
  } = state;

  const chainId = chainStringToId(chain);
  const chainInfo = CHAIN_MAP[chainId];
  let curveImage = '';

  if (curveType === 'LINEAR') curveImage = '/curve-linear.png';
  else if (curveType === 'EXPONENTIAL') curveImage = '/curve-exponential.png';
  else if (curveType === 'LOGARITHMIC') curveImage = '/curve-log.png';
  else if (curveType === 'FLAT') curveImage = '/curve-flat.png';
  return {
    title: `Deploy ERC-20 Token`,
    description: name,
    image: (
      <div tw="flex h-full w-full flex-col items-center justify-center p-10 text-3xl text-white">
        <div tw="text-5xl">🪙</div>
        <div tw="mt-2 flex text-3xl text-white">{name}</div>
        <div tw="flex text-xl text-gray-500">({symbol})</div>
        <div tw="my-10 flex h-[2px] w-full bg-yellow-500" />

        <div tw="flex w-full flex-wrap justify-between">
          <div tw="flex w-full items-center justify-around">
            <div tw="flex w-[33%] flex-col items-center justify-center">
              <div tw="text-lg text-gray-500">Chain</div>
              <div
                tw="flex items-center"
                style={{
                  color: chainInfo.color,
                }}
              >
                <img
                  tw="mr-2"
                  src={chainInfo.icon}
                  width={24}
                  height={24}
                  alt="chain"
                />
                {chainInfo.name}
              </div>
            </div>

            <div tw="flex w-[33%] flex-col items-center justify-center">
              <div tw="text-lg text-gray-500">Max Supply</div>
              <div tw="flex items-center">
                {commify(shortenNumber(maxSupply))}
              </div>
            </div>

            <div tw="flex w-[33%] flex-col items-center justify-center">
              <div tw="text-lg text-gray-500">Creator Allocation</div>
              <div tw="flex items-center">
                {commify(shortenNumber(creatorAllocation))}
              </div>
            </div>
          </div>

          <div tw="mt-5 flex w-full items-center justify-around">
            <div tw="flex w-[33%] flex-col items-center justify-center">
              <div tw="text-lg text-gray-500">Bonding Curve</div>
              <div
                tw="flex items-center"
                style={{
                  color: colors.primary,
                }}
              >
                <img
                  tw="mr-2"
                  src={curveImage}
                  width={24}
                  height={24}
                  alt="chain"
                />
                {curveType}
              </div>
            </div>

            <div tw="flex w-[33%] flex-col items-center justify-center">
              <div tw="text-lg text-gray-500">Starting Mint Price</div>
              <div tw="flex items-center text-green-500">
                {initialPrice} {baseToken.symbol}
              </div>
            </div>

            <div tw="flex w-[33%] flex-col items-center justify-center">
              <div tw="text-lg text-gray-500">Final Mint Price</div>
              <div tw="flex items-center text-green-500">
                {finalPrice} {baseToken.symbol}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    intents: [
      <Button value={NAVIGATE.SETTINGS} action={COMMON_ROUTES.settings}>
        ⚙️ Settings
      </Button>,
      <Button.Transaction target={COMMON_ROUTES.deploy}>
        Deploy
      </Button.Transaction>,
    ],
  };
}
