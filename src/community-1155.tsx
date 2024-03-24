/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { IpfsStatus } from '@prisma/client';
import { FrameContext, Frog } from 'frog';
import { NeynarVariables, neynar } from 'frog/middlewares';
import { LowerCaseChainNames } from 'mint.club-v2-sdk';
import { PinataFDK } from 'pinata-fdk';
import { NEYNAR_API_KEY, PINATA_API_JWT } from '../services/server-env';
import { ASSETS_PATH, COMMON_ROUTES } from './common/config';
import { GetStepParams } from './common/getStep';
import { community1155Handler } from './handlers/community1155/community1155-handler';
import { deployCommunity1155 } from './handlers/community1155/deploy';
import { NavigationState } from './navigators/baseFrameNavigator';

const fdk = new PinataFDK({
  pinata_jwt: PINATA_API_JWT,
  pinata_gateway: 'jade-general-jackal-249.mypinata.cloud',
});

export type CommunityBaseToken = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
};

export type CreateCommunity1155State = {
  chain: LowerCaseChainNames;
  baseToken?: CommunityBaseToken;
  collectionName?: string;
  imageUrl?: string;
  ipfsStatus?: IpfsStatus;
  royalty: number;

  // dynamically updatable through search params
  price?: number;
  maxSupply?: number;
};

export type Community1155ExtraParams = Pick<
  CreateCommunity1155State,
  'chain' | 'baseToken' | 'price' | 'maxSupply'
>;

export type Community1155Context<Path extends string> = FrameContext<
  Community1155RouteEnv,
  Path,
  {},
  Community1155NavigationState
>;

export type Community1155StepParams = GetStepParams<
  Community1155ExtraParams,
  Community1155NavigationState
>;

export type Community1155NavigationState =
  NavigationState<Community1155ExtraParams> & CreateCommunity1155State;

export type Community1155RouteEnv = {
  State: Community1155NavigationState;
  Variables: NeynarVariables & {
    chain: 'base' | 'optimism';
    baseToken?: CommunityBaseToken;
    price?: number;
    maxSupply?: number;
  };
};

export const app = new Frog<Community1155RouteEnv>({
  assetsPath: ASSETS_PATH,
  basePath: '/',

  initialState: {
    chain: 'base',
    curveType: 'FLAT',
    royalty: 5,
    stepCount: 2,
  },
});

app.use(
  neynar({
    apiKey: NEYNAR_API_KEY,
    features: ['interactor', 'cast'],
  }),
);

app.use(
  '/',
  fdk.analyticsMiddleware({
    frameId: 'community1155',
  }),
);

app.frame(
  '/:chain/:tokenAddress/:maxSupply{[0-9,]+}/:price{[0-9,]+}',
  community1155Handler,
);
app.frame('/:chain/:tokenAddress/:maxSupply{[0-9,]+}', community1155Handler);
app.frame('/:chain/:tokenAddress', community1155Handler);
app.transaction(COMMON_ROUTES.deploy, deployCommunity1155);
