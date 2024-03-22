/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button } from 'frog';
import { BackButton } from '../../common/Buttons';
import { SETTINGS } from '../../common/config';
import { ERC20StepParams } from '../../create-erc20';
import { ERC20DeployStep } from './step-deploy';

export function ERC20SettingsStep(params: ERC20StepParams) {
  const { state } = params;
  const { name } = state;

  return {
    title: `Collection Settings`,
    description: name,
    image: ERC20DeployStep(params).image,

    intents: [
      <BackButton action={'/'} />,
      <Button value={SETTINGS.NAME}>Name</Button>,
      <Button value={SETTINGS.SYMBOL}>Symbol</Button>,
      <Button value={SETTINGS.CHAIN}>Chain</Button>,
      <Button value={SETTINGS.MAX_SUPPLY}>Max supply</Button>,
      <Button value={SETTINGS.CREATOR_ALLOCATION}>Creator</Button>,
      <Button value={SETTINGS.CURVE}>Curve</Button>,
      <Button value={SETTINGS.BASE_TOKEN}>Base Token</Button>,
      <Button value={SETTINGS.INITIAL_PRICE}>Start Price</Button>,
      <Button value={SETTINGS.FINAL_PRICE}>Final Price</Button>,
      <BackButton action={'/'} />,
    ],
  };
}
