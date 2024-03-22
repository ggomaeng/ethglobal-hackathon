/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { colors } from '../../constants/colors';
import { truncateString } from '../../utils/strings';
import { ValiError } from 'valibot';

type ErrorProps = {
  error: any;
};

export function HandledErrorComponent(params: ErrorProps) {
  const { error } = params;
  let errorMessage = error?.message || error?.toString();

  if (error instanceof ValiError) {
    let newMessage = '';
    errorMessage = error.issues.map((issue) => {
      // const key = issue?.path?.[0].key;
      newMessage += `${issue.message}`;
    });
    errorMessage = newMessage;
  }

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
          {truncateString(errorMessage) || 'Unknown Error'}
        </div>
      </div>

      <div
        tw="absolute bottom-2 left-0 flex h-[6%] w-full items-center justify-center border-t px-5 text-xs text-gray-600"
        style={{
          fontFamily: 'roboto',
          letterSpacing: '0.1px',
        }}
      >
        <div tw="flex">Questions? Visit</div>
        <div tw="mx-1 flex text-gray-400">docs.mint.club</div>
        <div tw="flex">or DM</div>
        <div
          tw="mx-1 flex"
          style={{
            color: colors.warpcast,
          }}
        >
          @undefined
        </div>{' '}
        for help
      </div>
    </div>
  );
}
