/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { $Enums } from '@prisma/client';
import { FrameContext, Frog } from 'frog';
import { NeynarVariables, neynar } from 'frog/middlewares';
import { LowerCaseChainNames } from 'mint.club-v2-sdk';
import { NEYNAR_API_KEY, PINATA_API_JWT } from '../services/server-env';
import { ASSETS_PATH, COMMON_ROUTES, SETTINGS } from './common/config';
import { GetStepParams } from './common/getStep';
import { deployERC20 } from './handlers/erc20/deploy';
import { erc20Handler } from './handlers/erc20/erc20-handler';
import { ERC20SettingsHandler } from './handlers/erc20/erc20-settings-handler';
import { NavigationState } from './navigators/baseFrameNavigator';
import { PinataFDK } from 'pinata-fdk';
import { getXmtpFrameMessage } from 'frames.js/xmtp';

export const fdk = new PinataFDK({
  pinata_jwt: PINATA_API_JWT,
  pinata_gateway: 'jade-general-jackal-249.mypinata.cloud',
});

export type CreateERC20State = {
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
  name: string;
  symbol: string;
  initialPrice: number;
  finalPrice: number;
  maxSupply: number;
  creatorAllocation: number;
};

export type ERC20Context<Path extends string> = FrameContext<
  ERC20RouteEnv,
  Path,
  {},
  ERC20NavigationState
>;

export type ERC20StepParams = GetStepParams<
  CreateERC20State,
  ERC20NavigationState
>;

export type ERC20NavigationState = NavigationState<CreateERC20State> &
  CreateERC20State;

export type ERC20RouteEnv = {
  State: ERC20NavigationState;
  Variables: NeynarVariables;
};

export const app = new Frog<{
  State: CreateERC20State;
  Variables: NeynarVariables;
}>({
  assetsPath: ASSETS_PATH,
  basePath: '/',
  initialState: {
    chain: 'base',
    curveType: 'EXPONENTIAL',
    royalty: 0.3,
    stepCount: 20,
    baseToken: {
      address: '0x4200000000000000000000000000000000000006',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
    },
    name: '',
    symbol: '',
    initialPrice: 0.001,
    finalPrice: 0.1,
    maxSupply: 1_000_000,
    creatorAllocation: 0,
  },
});

app.use('/', async (c, next) => {
  const payload = await c.req.json();

  if (payload.clientProtocol.includes('xmtp')) {
    // TODO - handle xmtp
    const frameMessage = await getXmtpFrameMessage(payload);
    // console.log(frameMessage);

    await next();
    return;
  }

  await fdk.analyticsMiddleware({
    frameId: 'erc20',
  })(c, next);

  await neynar({
    apiKey: NEYNAR_API_KEY,
    features: ['interactor', 'cast'],
  })(c as any, next);
});

app.frame('/', erc20Handler);
app.frame(COMMON_ROUTES.settings, ERC20SettingsHandler);
app.transaction(COMMON_ROUTES.deploy, deployERC20);
