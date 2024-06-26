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
import { BackButton } from '../../common/Buttons';
import { NFT_ACTIONS } from '../../common/config';
import { Community1155StepParams } from '../../community-1155';

export function Community1155DeployStep({ state }: Community1155StepParams) {
  const { chain, baseToken, collectionName, imageUrl, price, maxSupply } =
    state;

  const chainId = chainStringToId(chain);
  const chainInfo = CHAIN_MAP[chainId];

  return {
    title: `Deploy Collection`,
    description: collectionName,
    image: (
      <div tw="flex h-full w-full flex-col items-center justify-center p-10 text-3xl text-white">
        <div tw="flex items-center">
          <img src={imageUrl} width={150} height={150} alt="" />
        </div>
        <div tw="my-2 flex text-lg text-gray-500">{collectionName}</div>

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
                {commify(shortenNumber(maxSupply!))}
              </div>
            </div>

            <div tw="flex w-[33%] flex-col items-center justify-center">
              <div tw="text-lg text-gray-500">Mint Price</div>
              <div tw="flex items-center text-green-500">
                {price} ${baseToken?.symbol}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    intents: [<BackButton />, <Button value={NFT_ACTIONS.IPFS}>Deploy</Button>],
  };
}
