/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { colors } from '../../constants/colors';
import { truncateString } from '../../utils/strings';

type ErrorProps = {
  error: any;
};

export function UnhandledErrorComponent(params: ErrorProps) {
  const { error } = params;

  const errorMessage = error?.message || error?.toString();

  return (
    <div
      id="error-component"
      tw="relative flex h-full w-full flex-col items-start text-2xl"
    >
      <img
        tw="absolute left-0 top-0  h-full w-full"
        src={`/bg.png`}
        width="100%"
        height="100%"
        style={{
          objectFit: 'contain',
        }}
        alt="bg"
      />

      <div tw="flex h-full w-full flex-col items-center justify-center p-20">
        <div tw="text-xl text-gray-500">Uh-oh...</div>
        <div tw="my-10 flex flex items-center justify-center text-center text-3xl text-red-500">
          Error: {truncateString(errorMessage) || 'Unknown Error'}
        </div>
        <div tw="mt-10 flex text-yellow-500">
          Please tag{' '}
          <span
            tw="mx-1"
            style={{
              color: colors.warpcast,
            }}
          >
            @undefined
          </span>{' '}
          and show him this message
        </div>
        <div tw="mt-20 flex flex-col items-center text-center text-lg text-white">
          <div tw="flex text-xl text-gray-500">
            This {`shouldn't`} have happened ☠️
          </div>
          <div tw="mt-10 text-center">Sorry 🙏</div>
          <div tw="text-center">you can go back and try again though!</div>
        </div>
      </div>
    </div>
  );
}
