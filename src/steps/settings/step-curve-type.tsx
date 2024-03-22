/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { BackButton } from '../../common/Buttons';
import { Button } from 'frog';
import { CURVES } from '../../common/config';

export const CurveSelectStep = {
  title: 'Choose Bonding Curve Type',
  image: (
    <div tw="flex flex-col items-center justify-center px-10 text-white">
      <div tw="flex text-white">Choose your price curve type</div>

      <div
        tw="mt-14 flex w-full items-center"
        style={{
          gap: 50,
        }}
      >
        <div tw="flex flex-col items-center justify-center">
          <img src="/curve-linear.png" width={32} height={32} alt="linear" />
          <div tw="mt-2 flex">Linear</div>
        </div>

        <div tw="flex flex-col items-center justify-center">
          <img
            src="/curve-exponential.png"
            width={32}
            height={32}
            alt="exponential"
          />
          <div tw="mt-2 flex">Exponential</div>
        </div>

        <div tw="flex flex-col items-center justify-center">
          <img src="/curve-log.png" width={32} height={32} alt="log" />
          <div tw="mt-2 flex">Logarithmic</div>
        </div>

        <div tw="flex flex-col items-center justify-center">
          <img src="/curve-flat.png" width={32} height={32} alt="flat" />
          <div tw="mt-2 flex">Flat</div>
        </div>
      </div>
    </div>
  ),

  intents: [
    <BackButton />,
    <Button value={CURVES.LINEAR}>Linear</Button>,
    <Button value={CURVES.EXPONENTIAL}>Exponential</Button>,
    <Button value={CURVES.LOGARITHMIC}>Log</Button>,
    <Button value={CURVES.FLAT}>Flat</Button>,
  ],
};
