/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button } from 'frog';
import { Community1155StepParams } from '../../community-1155';
import { NAVIGATE } from '../../navigators/baseFrameNavigator';
import { ValidationError } from '../../../errors/ValidationError';
import { colors } from '../../../constants/colors';
import { commify, getSubscriptNumber } from 'mint.club-v2-sdk';

export function Community1155StartStep({
  extraParams,
  state,
}: Community1155StepParams) {
  const { price, maxSupply } = extraParams;

  const baseToken = state.baseToken || extraParams.baseToken;

  if (!baseToken) {
    throw new ValidationError('Base token not found');
  }

  const { symbol, address, name, logo } = baseToken;

  let rules = [];

  if (price) {
    rules.push([
      'Price per mint',
      `${commify(
        getSubscriptNumber({
          number: price,
        }),
      )} ${symbol}`,
    ]);
  }

  if (maxSupply) {
    rules.push([
      'Max supply',
      commify(
        getSubscriptNumber({
          number: maxSupply,
        }),
      ),
    ]);
  }

  return {
    title: `${symbol} NFT Collections 🖼️`,
    description: `Deploy NFT mintable with $${baseToken?.symbol}`,
    image: (
      <div tw="flex h-full w-full flex-col items-center justify-center text-3xl text-white">
        {logo ? (
          <img tw="rounded-full" src={logo} width={40} height={40} />
        ) : (
          <div tw="text-4xl">🪙</div>
        )}
        <div tw="mt-2">{name}</div>
        <div
          tw="text-xl"
          style={{
            color: colors.primary,
          }}
        >
          {symbol}
        </div>
        <div
          tw="mt-5 text-sm text-gray-500"
          style={{
            fontFamily: 'roboto',
          }}
        >
          {address}
        </div>

        <div tw="mt-10 flex flex-col items-center px-10 text-center text-xl text-gray-500">
          <div tw="mb-5 flex border-b-2 border-yellow-300 px-5 pb-2 text-center text-yellow-300">
            Tip
          </div>
        </div>

        {rules.length > 0 ? (
          <div tw="flex flex-col items-center px-10 text-center text-xl text-gray-500">
            <div
              tw="flex items-center text-center text-xl"
              style={{
                color: colors.twitter,
              }}
            >
              collections launched through this frame will have
            </div>

            <div
              tw="mt-5 flex flex-wrap items-center justify-center text-xl text-white"
              style={{
                gap: 20,
              }}
            >
              {rules.map(([rule, value]) => (
                <div tw="flex flex-col items-center justify-center">
                  <div tw="flex text-center text-lg text-gray-500">{rule}</div>
                  <div tw="flex text-center">{value}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div tw="flex items-center text-center text-lg">
            You can deploy a NFT Collection
            <span tw="mx-1 text-green-500">
              mintable with ${baseToken?.symbol}
            </span>{' '}
            through this frame
          </div>
        )}
      </div>
    ),
    intents: [
      <Button value={NAVIGATE.STEP_NEXT}>
        Deploy ${baseToken?.symbol} backed NFT ⚡
      </Button>,
    ],
  };
}
