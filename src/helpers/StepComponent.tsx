/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { colors } from '../../constants/colors';
import { cn } from '../../utils/classnames';

type StepProps = {
  title?: string;
  step?: number;
  totalSteps?: number;
  children: JSX.Element;
  stepHeaderElement?: JSX.Element;
  description?: string;
};

export function StepComponent(params: StepProps) {
  const { title, children, description, step, totalSteps } = params;
  let progress = 100;

  if (step !== undefined && totalSteps !== undefined && totalSteps !== 0) {
    progress = (step / totalSteps) * 100;
  }

  return (
    <div tw="step-component relative flex h-full w-full flex-col items-start text-2xl">
      <img
        tw="absolute left-0 top-0 z-[0] h-full w-full"
        src={`/bg.png`}
        width="100%"
        height="100%"
        style={{
          objectFit: 'contain',
          zIndex: 0,
        }}
        alt="bg"
      />

      <div
        tw="absolute flex h-full w-full flex-col items-center justify-center"
        style={{
          zIndex: 1,
          paddingTop: '18%',
          paddingBottom: '6%',
        }}
      >
        {children}
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

      <div
        tw="absolute left-0 top-0 flex w-full justify-between"
        style={{ zIndex: 10, height: '18%' }}
      >
        <div tw="relative flex h-full w-full items-center justify-between bg-black/70">
          <div tw={cn('flex h-full flex-col items-start justify-between p-5')}>
            <div
              tw="flex text-3xl"
              style={{
                color: colors.white,
              }}
            >
              {title}
            </div>
            {description !== undefined ? (
              <div tw="flex text-xl text-gray-500">{description}</div>
            ) : (
              <div tw="flex text-xl text-gray-500">
                Step {step} of {totalSteps}
              </div>
            )}
          </div>

          <div tw="flex h-full flex-col items-end justify-between p-5">
            <img src="/mint-logo.png" width="24" height="24" alt="logo" />
            <div tw="flex flex-col items-end text-sm uppercase text-gray-500">
              <div tw="mt-2 flex items-center">
                <img
                  tw="flex"
                  src="/zap.png"
                  width="12"
                  height="12"
                  alt="logo"
                />
                <div tw="mx-1 flex">Powered by</div>
                <div tw="flex" style={{ color: colors.primary }}>
                  Mint.club
                </div>
              </div>

              <div tw="flex">Bonding Curve Protocol</div>
            </div>
          </div>

          <div
            tw="absolute bottom-0 left-0 flex h-[4px] w-full"
            style={{
              zIndex: 10,
              backgroundColor: colors.warpcast,
              height: 4,
              opacity: 0.2,
            }}
          />

          <div
            tw="absolute bottom-0 left-0 flex"
            style={{
              zIndex: 10,
              backgroundColor: colors.warpcast,
              height: 4,
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
