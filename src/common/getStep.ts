import { StepComponent } from '../helpers/StepComponent';
import { NavigationState } from '../navigators/baseFrameNavigator';
import { NextStepNotFound } from '../../errors/ValidationError';
import { NeynarUser } from 'frog/middlewares';
import { cloneDeep } from 'lodash-es';
import { FrameIntent } from 'frog';

export type ExtraParams<E extends object | string | undefined | null = object> =
  E;

export type GetStepParams<
  Extra extends ExtraParams = ExtraParams,
  State extends NavigationState<ExtraParams> = NavigationState<ExtraParams>,
> = {
  user?: NeynarUser;
  state: State;
  previousState: State;
  extraParams: Extra;
  stepHeaderElement?: JSX.Element;
};

export type CommonFrame = {
  action?: string;
  description?: string;
  title?: string | undefined;
  intents: FrameIntent[];
  image: string | JSX.Element;
  imageAspectRatio?: string; // 1.91:1 or 1:1
};

export type StepData<
  Extra extends ExtraParams = ExtraParams,
  State extends NavigationState<ExtraParams> = NavigationState<ExtraParams>,
> =
  | CommonFrame
  | ((params: any) => CommonFrame)
  | ((params: GetStepParams<Extra, State>) => CommonFrame)
  | ((
      params: GetStepParams<Extra, State>,
    ) => Promise<CommonFrame> | CommonFrame);

export async function getStep<
  Extra extends ExtraParams = ExtraParams,
  State extends NavigationState<ExtraParams> = NavigationState<ExtraParams>,
  Step extends StepData<Extra, State> = StepData<Extra, State>,
>(params: GetStepParams<Extra, State>, steps: Step[]) {
  const { stepHeaderElement } = params;
  const { step = 0 } = params.state;
  const generateStep = steps[Math.min(step, steps.length - 1)];

  if (generateStep === undefined) {
    throw new NextStepNotFound();
  }

  let frameToReturn: StepData<Extra, State>;

  if (typeof generateStep === 'function') {
    frameToReturn = await generateStep(params);
  } else {
    frameToReturn = generateStep;
  }

  frameToReturn = cloneDeep(frameToReturn);

  if (typeof frameToReturn.image !== 'string') {
    frameToReturn.image = StepComponent({
      title: frameToReturn.title,
      children: frameToReturn.image,
      description: frameToReturn.description,
      step,
      totalSteps: steps.length - 1,
      stepHeaderElement,
    });
  }

  return frameToReturn;
}
