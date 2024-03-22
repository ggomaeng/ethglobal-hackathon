/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button, TextInput } from 'frog';
import { NeynarUser } from 'frog/_lib/middlewares';
import { BackButton } from '../../common/Buttons';
import { NFT_ACTIONS } from '../../common/config';

export function UploadImageStep({ user }: { user?: NeynarUser }) {
  const hasPFP = user?.pfpUrl;
  return {
    title: 'Choose Image',
    image: (
      <div tw="relative flex flex-col items-center justify-center p-10 text-white">
        <div tw="flex">
          Upload / Choose an image to use for your NFT Collection
        </div>
        <div tw="mt-10 flex flex-col items-center justify-center text-xl">
          {hasPFP ? (
            <div tw="flex flex-col items-center justify-center">
              <img
                src={user?.pfpUrl}
                width="200"
                height="200"
                style={{
                  objectFit: 'cover',
                }}
                alt=""
              />
              <div tw="mt-5 text-gray-500">Current Profile Picture</div>
            </div>
          ) : (
            <div>{`Upload an image for the NFT`}</div>
          )}
        </div>
      </div>
    ),

    intents: [
      <TextInput placeholder="Image URL (https://...)" />,
      <BackButton />,
      <Button value={NFT_ACTIONS.UPLOAD}>📁 Upload</Button>,
      hasPFP ? <Button value={NFT_ACTIONS.PFP}>🙂 Use My PFP</Button> : null,
    ],
  };
}
