import { LowerCaseChainNames } from 'mint.club-v2-sdk';

export const ASSETS_PATH = `/frames/assets/`;
export const BASE_FRAMES_PATH = '/frames/';

export type CurveType = 'LINEAR' | 'EXPONENTIAL' | 'LOGARITHMIC' | 'FLAT';

export const DERIVATIVE_NFT_ROUTES = {
  base: '/',
  network: '/network',
  process: '/process',
  collection: '/collection',
  curve: '/curve',
} as const;

export const COMMON_ROUTES = {
  settings: '/settings',
  deploy: '/deploy',
  approve: `/approve`,
  confirm: `/confirm`,
  validate: `/validate`,
} as const;

// only supported chains at the moment
export const NETWORKS: Record<string, LowerCaseChainNames> = {
  BASE: 'base',
  OPTIMISM: 'optimism',
};

export const CURVES: Record<string, CurveType> = {
  LINEAR: 'LINEAR',
  EXPONENTIAL: 'EXPONENTIAL',
  LOGARITHMIC: 'LOGARITHMIC',
  FLAT: 'FLAT',
};

export const SETTINGS: Record<string, `SETTINGS_${string}`> = {
  GOTO_SETTINGS: 'SETTINGS_INIT',
  IMAGE: 'SETTINGS_IMAGE',
  NAME: 'SETTINGS_NAME',
  CHAIN: 'SETTINGS_CHAIN',
  CURVE: 'SETTINGS_CURVE',
  BASE_TOKEN: 'SETTINGS_BASE_TOKEN',
  MAX_SUPPLY: 'SETTINGS_MAX_SUPPLY',
  CREATOR_ALLOCATION: 'SETTINGS_CREATOR_ALLOCATION',
  INITIAL_PRICE: 'SETTINGS_INITIAL_PRICE',
  FINAL_PRICE: 'SETTINGS_MAX_PRICE',
  STEP_COUNT: 'SETTINGS_STEP_COUNT',
  BUY_ROYALTY: 'SETTINGS_BUY_ROYALTY',
  SELL_ROYALTY: 'SETTINGS_SELL_ROYALTY',
};

export const COMMON_ACTIONS = {
  SET_NAME: 'NAME',
  SET_CHAIN: 'CHAIN',
  SET_CURVE: 'CURVE',
  SET_BASE_TOKEN: 'BASE_TOKEN',
  CONFIRM_BASE_TOKEN: 'CONFIRM_BASE_TOKEN',
  SET_MAX_SUPPLY: 'MAX_SUPPLY',
  SET_CREATOR_ALLOCATION: 'CREATOR_ALLOCATION',
  SET_INITIAL_PRICE: 'INITIAL_PRICE',
  SET_FINAL_PRICE: 'FINAL_PRICE',
  SET_STEP_COUNT: 'STEP_COUNT',
  SET_BUY_ROYALTY: 'BUY_ROYALTY',
  SET_SELL_ROYALTY: 'SELL_ROYALTY',
  REFRESH: 'REFRESH',
} as const;

export const NFT_ACTIONS = {
  UPLOAD: 'BUTTON_UPLOAD',
  PFP: 'BUTTON_PFP',
  TYPE_COLLECTION: 'BUTTON_TYPE_DERIVATIVE',
  TYPE_DERIVATIVE: 'BUTTON_TYPE_DERIVATIVE',
  IPFS: 'UPLOAD_IPFS',
} as const;

export const MINT_ACTIONS = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;
