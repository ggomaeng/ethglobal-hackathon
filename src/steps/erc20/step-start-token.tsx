/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { NAVIGATE } from '../../navigators/baseFrameNavigator';
import { Button } from 'frog';

export const ERC20StartStep = {
  image: '/token-optimized.gif',
  intents: [
    <Button value={NAVIGATE.STEP_NEXT}>Start FRC-20 Deploy Wizard ⚡</Button>,
  ],
};
