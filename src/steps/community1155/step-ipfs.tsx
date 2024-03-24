/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { BackButton, RefreshButton } from '../../common/Buttons';
import { colors } from '../../../constants/colors';
import { timeAgo } from '../../../utils/time';
import { Button } from 'frog';
import { COMMON_ROUTES } from '../../common/config';
import { Community1155StepParams } from '../../community-1155';

export function Community1155IpfsStep({ state }: Community1155StepParams) {
  const { ipfsStatus } = state;

  let buttons = [<BackButton />, <RefreshButton />];

  let colorText = 'white';
  let text = 'Uploading to IPFS';

  if (ipfsStatus?.status === 'FAILED') {
    text = 'Failed to upload to IPFS';
    colorText = colors.error;
    buttons = [<BackButton />];
  } else if (ipfsStatus?.status === 'SUCCESS') {
    text = 'Uploaded to IPFS';
    buttons = [
      <BackButton />,
      <Button.Transaction target={COMMON_ROUTES.deploy}>
        Deploy
      </Button.Transaction>,
    ];
  }

  return {
    title: text,
    image:
      ipfsStatus?.status === 'SUCCESS' ? (
        <div tw=" flex flex-col items-center justify-center p-10 text-white">
          <div tw="text-4xl">🚀</div>
          <div tw="mt-5 flex text-center text-3xl">You are all set!</div>
          <div
            tw="mt-5 text-xl"
            style={{
              color: colors.primary,
            }}
          >
            Click "Deploy" to deploy the contract
          </div>
        </div>
      ) : (
        <div tw=" flex flex-col items-center justify-center p-10 text-white">
          <div tw="text-4xl">📦</div>
          <div
            tw="mt-5 flex text-center text-3xl"
            style={{
              color: colorText,
            }}
          >
            {text}
          </div>

          <div tw="mt-10 flex flex-col items-center px-10 text-center text-xl text-gray-500">
            <div tw="mb-5 flex border-b-2 border-yellow-300 px-5 pb-2 text-center text-yellow-300">
              Tip
            </div>
            <div tw="flex items-center text-center text-lg">
              Click on the{' '}
              <span
                tw="mx-1"
                style={{
                  color: colors.twitter,
                }}
              >
                refresh
              </span>{' '}
              button to check the status of your upload
            </div>
            <div tw="flex text-center text-lg text-yellow-500">
              Last refreshed:{' '}
              {timeAgo(
                Date.now() - (ipfsStatus?.createdAt?.getTime() || Date.now()),
              )}
            </div>
          </div>
        </div>
      ),
    intents: buttons,
  };
}
