/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { Button, FrameContext, FrameIntent } from 'frog';
import { NeynarVariables } from 'frog/middlewares';
import { ValiError } from 'valibot';
import {
  NextStepNotFound,
  ValidationError,
} from '../../errors/ValidationError';
import { Logger } from '../../utils/Logger';
import { isTrue } from '../../utils/logic';
import { BackButton } from '../common/Buttons';
import { COMMON_ACTIONS, SETTINGS } from '../common/config';
import { CommonFrame, ExtraParams, StepData, getStep } from '../common/getStep';
import { HandledErrorComponent } from '../helpers/HandledErrorComponent';
import { UnhandledErrorComponent } from '../helpers/UnhandledErrorComponent';

type FrameImageAspectRatio = '1:1' | '1.91:1';

export type FrogEnv<T extends object = object> = {
  State: T;
  Variables: NeynarVariables;
};

export type NavigationState<T> = {
  isErrorPage?: boolean;
  settings?: keyof typeof SETTINGS;
  step?: number;
  buttonPage?: number;
  settingsButtonPage?: number;
  extraParams?: T;
};

export const NAVIGATE = {
  // NO VALIDATION
  OPTIONS_PAGE_NEXT: 'OPTIONS_PAGE_NEXT',
  OPTIONS_PAGE_BACK: 'OPTIONS_PAGE_BACK',
  SETTINGS: 'SETTINGS',
  STEP_NEXT: 'STEP_NEXT',
  STEP_BACK: 'STEP_BACK',
  CANCEL: 'CANCEL',
};

type BeforeNavigateReturnType<Extra extends ExtraParams = ExtraParams> =
  | Promise<Extra>
  | Promise<void>
  | Promise<undefined>
  | Promise<string>
  | Extra
  | string
  | void
  | null
  | undefined
  | object;

export type BeforeNavigateType<
  Extra extends ExtraParams = ExtraParams,
  State extends NavigationState<Extra> = NavigationState<Extra>,
> = (
  previousState: State,
) => Promise<BeforeNavigateReturnType<Extra> | void | null>;

function isNavigate(value: string | undefined) {
  return (
    value === NAVIGATE.OPTIONS_PAGE_NEXT ||
    value === NAVIGATE.OPTIONS_PAGE_BACK ||
    value === NAVIGATE.STEP_NEXT ||
    value === NAVIGATE.STEP_BACK ||
    value === NAVIGATE.CANCEL
  );
}

function isSettingsOption(value: string | undefined) {
  return value?.includes('SETTINGS');
}

export type NavigatorParams<
  Extra extends ExtraParams = ExtraParams,
  Env extends FrogEnv = FrogEnv,
  Path extends string = string,
  State extends NavigationState<Extra> = NavigationState<Extra>,
  Step extends StepData<Extra, State> = StepData<Extra, State>,
  BeforeNavigate extends BeforeNavigateType<Extra, State> = BeforeNavigateType<
    Extra,
    State
  >,
  Context extends FrameContext<Env, Path, {}, State> = FrameContext<
    Env,
    Path,
    {},
    State
  >,
> = {
  path: Path;
  context: Context;
  extraParams?: Extra;
  deriveState?: BeforeNavigate;
  summaryFunction?: (state: Extra) => JSX.Element;
  isSettings?: boolean;
  steps: Step[];
  overrideFrame?: (state: State) => CommonFrame | undefined;
  browserLocation?: string;
};

export async function baseFrameNavigator<
  Extra extends ExtraParams = ExtraParams,
  Env extends FrogEnv = FrogEnv,
  Path extends string = string,
  State extends NavigationState<Extra> = NavigationState<Extra>,
  Step extends StepData<Extra, State> = StepData<Extra, State>,
  AfterNavigate extends BeforeNavigateType<Extra, State> = BeforeNavigateType<
    Extra,
    State
  >,
  Context extends FrameContext<Env, Path, {}, State> = FrameContext<
    Env,
    Path,
    {},
    State
  >,
>(
  params: NavigatorParams<
    Extra,
    Env,
    Path,
    State,
    Step,
    AfterNavigate,
    Context
  >,
) {
  const {
    path,
    context,
    deriveState: beforeNextStep,
    extraParams: _extraParams,
    isSettings,
    overrideFrame,
    summaryFunction,
    browserLocation,
    steps,
  } = params;
  const { buttonValue, deriveState, previousState } = context;
  let extraParams: Extra = _extraParams ?? ({} as Extra);
  let stepHeaderElement: JSX.Element | undefined;

  try {
    const state = await deriveState(async (previousState) => {
      const result = await beforeNextStep?.(previousState).catch();
      if (isTrue(result)) {
        stepHeaderElement = summaryFunction?.(result as Extra);
      } else {
        stepHeaderElement = summaryFunction?.(extraParams);
      }

      if (previousState.step === undefined) previousState.step = 0;
      if (previousState.buttonPage === undefined) previousState.buttonPage = 0;
      if (previousState.settingsButtonPage === undefined)
        previousState.settingsButtonPage = 0;

      // settings shouldn't affect the step

      if (buttonValue === NAVIGATE.SETTINGS) {
        previousState.step++;
      }
      if (buttonValue === NAVIGATE.OPTIONS_PAGE_NEXT) {
        if (isSettings && !previousState.settings) {
          previousState.settingsButtonPage++;
        } else {
          previousState.buttonPage++;
        }
      } else if (buttonValue === NAVIGATE.OPTIONS_PAGE_BACK) {
        if (isSettings && !previousState.settings) {
          previousState.settingsButtonPage--;
        } else {
          previousState.buttonPage--;
        }
      } else if (isSettings) {
        if (isSettingsOption(buttonValue)) {
          previousState.buttonPage = 0;
          previousState.settings = buttonValue as keyof typeof SETTINGS;
        } else if (previousState.isErrorPage) {
          // navigating back from error page
          previousState.isErrorPage = false;
        } else {
          previousState.settings = undefined;
        }
      } else if (
        buttonValue === NAVIGATE.STEP_BACK ||
        buttonValue === NAVIGATE.CANCEL
      ) {
        previousState.step--;
        previousState.buttonPage = 0;
        previousState.settingsButtonPage = 0;
        previousState.settings = undefined;
      } else if (
        buttonValue !== COMMON_ACTIONS.REFRESH &&
        (buttonValue === NAVIGATE.STEP_NEXT || buttonValue !== undefined)
      ) {
        previousState.step++;
        previousState.buttonPage = 0;
      }
    });

    const { buttonPage = 0, settingsButtonPage = 0 } = state;

    const frame =
      overrideFrame?.(state) ??
      (await getStep<Extra, State, Step>(
        {
          state,
          previousState,
          user: context.var.interactor,
          extraParams,
          stepHeaderElement,
        },
        steps,
      ));

    const { intents, image, imageAspectRatio } = frame;

    let finalIntentsToDisplay: FrameIntent[] = [];

    const buttonCount = intents?.filter((node) => {
      const value = node?.valueOf() as {
        props: { placeholder: string; value?: string };
      };

      // if (value?.tag instanceof CancelButton) hasCancelButton = true;
      return !value?.props?.placeholder;
    }).length;

    // if there are more than 4 buttons, we need to paginate
    // this excludes text input
    const buttonPageToUse = state.settings ? buttonPage : settingsButtonPage;

    if (buttonCount > 4) {
      let sliceStart = buttonPageToUse * 3;
      let sliceEnd = sliceStart + 3;
      if (buttonPageToUse > 0) {
        finalIntentsToDisplay.push(
          <Button value={NAVIGATE.OPTIONS_PAGE_BACK}>◄</Button>,
        );

        sliceStart = buttonPageToUse * 2 + 1;
        sliceEnd = sliceStart + 2;
      }

      const buttonsToPush = intents.slice(sliceStart, sliceEnd);
      finalIntentsToDisplay.push(...buttonsToPush);

      if (sliceEnd < intents.length) {
        finalIntentsToDisplay = [
          ...finalIntentsToDisplay,
          <Button value={NAVIGATE.OPTIONS_PAGE_NEXT}>►</Button>,
        ];
      }
    } else {
      finalIntentsToDisplay = intents;
    }

    const aspectRatio = (imageAspectRatio || '1:1') as FrameImageAspectRatio;

    return context.res({
      title: 'Mint.club Frames',
      action: path,
      imageAspectRatio: aspectRatio,
      image,
      intents: finalIntentsToDisplay,
      browserLocation,
    });
  } catch (error: any) {
    if (!(error instanceof ValidationError)) {
      Logger.error(error);
    }
    console.error(error);

    const state = deriveState((previousState) => {
      previousState.isErrorPage = true;
      if (previousState.step === undefined) previousState.step = 0;
      if (!(error instanceof NextStepNotFound) && !isSettings) {
        previousState.step++;
      }
    });

    extraParams = state as unknown as Extra;
    stepHeaderElement = summaryFunction?.(extraParams);

    if (error instanceof ValidationError || error instanceof ValiError) {
      return context.res({
        imageAspectRatio: '1:1',
        image: HandledErrorComponent({
          error,
        }),
        intents: [<BackButton />],
      });
    }

    return context.res({
      imageAspectRatio: '1:1',
      image: UnhandledErrorComponent({
        error,
      }),
      intents: [<BackButton />],
    });
  }
}
