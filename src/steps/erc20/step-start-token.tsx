/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { NAVIGATE } from '../../navigators/baseFrameNavigator';
import { Button } from 'frog';

export const ERC20StartStep = {
  image: 'https://i.imgur.com/81axGb6.gif',
  intents: [
    <Button value={NAVIGATE.STEP_NEXT}>Start ERC-20 Deploy Wizard ⚡</Button>,
  ],
};
