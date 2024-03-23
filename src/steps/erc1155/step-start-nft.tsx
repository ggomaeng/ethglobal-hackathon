/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { NAVIGATE } from '../../navigators/baseFrameNavigator';
import { Button } from 'frog';

export const ERC1155StartStep = {
  image: 'https://i.imgur.com/hHOdqP1.gif',
  intents: [
    <Button value={NAVIGATE.STEP_NEXT}>Start ERC-1155 Deploy Wizard ⚡</Button>,
  ],
};
