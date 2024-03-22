/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { $Enums, IpfsStatus } from '@prisma/client';
import { FrameContext, Frog } from 'frog';
import { NeynarVariables, neynar } from 'frog/middlewares';
import { LowerCaseChainNames } from 'mint.club-v2-sdk';
import { NEYNAR_API_KEY } from '../services/server-env';
import { ASSETS_PATH, COMMON_ROUTES, SETTINGS } from './common/config';
import { GetStepParams } from './common/getStep';
import { deployERC1155 } from './handlers/erc1155/deploy';
import { erc1155Handler } from './handlers/erc1155/erc1155-handler';
import { settingsHandler } from './handlers/erc1155/settings-handler';
import { NavigationState } from './navigators/baseFrameNavigator';

export type CreateERC1155State = {
  settings?: keyof typeof SETTINGS;
  chain: LowerCaseChainNames;
  curveType: $Enums.CurveType;
  royalty: number;
  stepCount: number;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  newBaseToken?: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  initialPrice: number;
  finalPrice: number;
  maxSupply: number;
  creatorAllocation: number;
  collectionName?: string;
  imageUrl?: string;
  ipfsStatus?: IpfsStatus;
};

export type ERC1155Context<Path extends string> = FrameContext<
  ERC1155RouteEnv,
  Path,
  {},
  ERC1155NavigationState
>;

export type ERC1155StepParams = GetStepParams<
  CreateERC1155State,
  ERC1155NavigationState
>;

export type ERC1155NavigationState = NavigationState<CreateERC1155State> &
  CreateERC1155State;

export type ERC1155RouteEnv = {
  State: ERC1155NavigationState;
  Variables: NeynarVariables;
};

export const app = new Frog<{
  State: CreateERC1155State;
  Variables: NeynarVariables;
}>({
  assetsPath: ASSETS_PATH,
  basePath: '/',
  initialState: {
    chain: 'base',
    curveType: 'EXPONENTIAL',
    royalty: 5,
    stepCount: 20,
    baseToken: {
      address: '0x4200000000000000000000000000000000000006',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
    },
    initialPrice: 0.1,
    finalPrice: 1,
    maxSupply: 10_000,
    creatorAllocation: 100,
  },
});

app.use(
  neynar({
    apiKey: NEYNAR_API_KEY,
    features: ['interactor', 'cast'],
  }),
);

app.frame('/', erc1155Handler);
app.frame(COMMON_ROUTES.settings, settingsHandler);
app.transaction(COMMON_ROUTES.deploy, deployERC1155);
