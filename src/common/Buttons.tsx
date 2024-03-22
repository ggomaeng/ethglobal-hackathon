/** @jsxImportSource frog/jsx */

import { COMMON_ACTIONS } from './config';
import { NAVIGATE } from '../navigators/baseFrameNavigator';
import { Button } from 'frog';

export const BackButton = (props: { name?: string; action?: string }) => (
  <Button value={NAVIGATE.STEP_BACK} action={props?.action}>
    {props?.name || 'Back'}
  </Button>
);

export const CancelButton = (props: { action?: string }) => (
  <Button value={NAVIGATE.CANCEL} action={props?.action}>
    {'❌ Cancel'}
  </Button>
);

export const NextButton = (props: { name?: string; action?: string }) => (
  <Button value={NAVIGATE.STEP_NEXT} action={props?.action}>
    {props?.name || 'Continue'}
  </Button>
);

export const RefreshButton = (props: { name?: string }) => (
  <Button value={COMMON_ACTIONS.REFRESH}>{props?.name || '🔃 Refresh'}</Button>
);
