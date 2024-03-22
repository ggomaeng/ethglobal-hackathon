/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { Button } from 'frog';
import queryString from 'query-string';
import { ERC1155StepParams } from '../../create-erc1155';
import { colors } from '../../../constants/colors';

export async function CompleteStep({ state }: ERC1155StepParams) {
  const { imageUrl, ipfsStatus, chain } = state;

  const link = `https://mint.club/nft/${chain}/${ipfsStatus?.nftSymbol}`;

  const searchParams = queryString.stringify({
    text: `I just deployed my ERC-1155 Collection!\n\n${link}`,
    'embeds[]': link,
  });

  const warpcast = `https://warpcast.com/~/compose?${searchParams}`;

  return {
    title: 'Deploy Complete!',
    description: 'Your NFT collection is now live!',
    image: (
      <div tw=" flex flex-col items-center justify-center p-10 text-white">
        <img
          tw="flex rounded-lg border border-white/50"
          src={imageUrl}
          width={200}
          height={200}
          alt="img"
        />
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
