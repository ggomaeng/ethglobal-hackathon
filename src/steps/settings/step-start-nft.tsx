/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { NAVIGATE } from '../../navigators/baseFrameNavigator';
import { Button } from 'frog';

export const StartStep = {
  image: '/nft-optimized.gif',
  intents: [
    <Button value={NAVIGATE.STEP_NEXT}>Start NFT Deploy Wizard ⚡</Button>,
  ],
};
