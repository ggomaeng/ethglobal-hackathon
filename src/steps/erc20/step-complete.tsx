/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { Button } from 'frog';
import queryString from 'query-string';
import { colors } from '../../../constants/colors';
import { ERC20StepParams } from '../../create-erc20';

export async function ERC20CompleteStep({ state }: ERC20StepParams) {
  const { symbol, chain } = state;

  const link = `https://mint.club/token/${chain}/${symbol}`;

  const searchParams = queryString.stringify({
    text: `I just deployed my ERC-20 Token!\n\n${link}`,
    'embeds[]': link,
  });

  const warpcast = `https://warpcast.com/~/compose?${searchParams}`;

  return {
    title: 'Deploy Complete!',
    description: 'Your NFT collection is now live!',
    image: (
      <div tw=" flex flex-col items-center justify-center p-10 text-white">
        <div tw="text-5xl">🪙</div>
        <div tw="mt-10 text-4xl">🎉</div>
        <div tw="mt-5 flex text-center text-3xl">Deploy Complete!</div>
        <div
          tw="mt-2 text-xl"
          style={{
            color: colors.twitter,
          }}
        >
          Share the link & other users will be able to mint through your NFT
          frame
        </div>
      </div>
    ),
    intents: [
      <Button.Reset>Go back</Button.Reset>,
      <Button.Link href={link}>NFT Page</Button.Link>,
      <Button.Link href={warpcast}>Share</Button.Link>,
    ],
  };
}
