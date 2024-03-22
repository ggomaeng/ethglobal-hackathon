/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { BackButton } from '../../common/Buttons';
import { NFT_ACTIONS } from '../../common/config';
import { ERC1155StepParams } from '../../create-erc1155';
import { colors as COLORS } from '../../../constants/colors';
import { getSubscriptNumber } from '../../../utils/numbers';
import { Button } from 'frog';
import { CHAIN_MAP, chainStringToId } from 'mint.club-v2-sdk';

export async function ReviewStep({ extraParams }: ERC1155StepParams) {
  const {
    chain,
    curveType,
    baseToken,
    collectionName,
    finalPrice,
    imageUrl,
    initialPrice,
    maxSupply,
  } = extraParams;

  const chainId = chainStringToId(chain);
  const chainInfo = CHAIN_MAP[chainId];
  let curveImage = '';

  if (curveType === 'LINEAR') curveImage = '/curve-linear.png';
  else if (curveType === 'EXPONENTIAL') curveImage = '/curve-exponential.png';
  else if (curveType === 'LOGARITHMIC') curveImage = '/curve-log.png';
  else if (curveType === 'FLAT') curveImage = '/curve-flat.png';

  return {
    title: 'Review NFT Details',
    image: (
      <div
        tw="relative flex h-full w-full flex-col p-10 text-2xl text-white"
        style={{
          gap: 8,
        }}
      >
        <div tw="mt-2 flex w-full items-start justify-start">
          <div tw="flex items-start">
            <img src={imageUrl!} alt="collection" width="120" height="120" />

            <div tw="ml-5 flex flex-col">
              <div tw="mt-4 flex flex-col items-start text-base text-gray-500">
                <div tw="flex text-4xl leading-none text-white">
                  {collectionName}
                </div>

                <div tw="mt-3 flex items-center">
                  <div>Deployed on</div>
                  <img
                    tw="ml-2"
                    src={chainInfo.icon}
                    alt="chain"
                    width="16"
                    height="16"
                  />
                  <div
                    tw="mx-2 flex"
                    style={{
                      color: chainInfo.color,
                    }}
                  >
                    {chainInfo.name} Chain
                  </div>

                  <div tw="flex items-center">
                    <div tw="mr-1">Mintable with</div>
                    <div
                      tw="flex"
                      style={{
                        color: COLORS.twitter,
                      }}
                    >
                      ${baseToken?.symbol}
                    </div>
                  </div>
                </div>

                <div
                  tw="text-sm text-white"
                  style={{
                    fontFamily: 'roboto',
                  }}
                >
                  {baseToken?.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div tw="my-10 flex h-[2px] w-full bg-gray-500" />

        <div tw="flex w-full flex-col items-start justify-start text-lg">
          <div tw="text-base text-yellow-500">Curve Information</div>
          <div tw="flex flex-col justify-start">
            <div tw="flex flex-wrap items-center" style={{ gap: 4 }}>
              <div
                tw="flex items-center"
                style={{
                  color: COLORS.primary,
                  gap: 8,
                }}
              >
                <img src={curveImage} width={16} height={16} alt="curve" />
                {curveType}
              </div>
              <div>Bonding Curve starting from</div>

              <div
                tw="flex"
                style={{
                  color: COLORS.twitter,
                }}
              >
                {getSubscriptNumber({
                  number: initialPrice!,
                })}{' '}
                ${baseToken?.symbol}
              </div>

              <div>and Ending at</div>

              <div
                tw="flex"
                style={{
                  color: COLORS.twitter,
                }}
              >
                {getSubscriptNumber({
                  number: finalPrice!,
                })}{' '}
                ${baseToken?.symbol}
              </div>
            </div>
          </div>

          <div tw="mt-5 text-base text-yellow-500">Token Information</div>
          <div tw="flex w-full items-center" style={{ gap: 2 }}>
            <div>Max Supply</div>
            <div
              tw="flex"
              style={{
                color: COLORS.primary,
              }}
            >
              {getSubscriptNumber({
                number: maxSupply!,
              })}
            </div>
          </div>
        </div>
      </div>
    ),

    intents: [
      <BackButton />,
      <Button value={NFT_ACTIONS.IPFS}>⬆️ Upload to IPFS</Button>,
    ],
  };
}
