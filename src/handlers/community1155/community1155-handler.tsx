/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { chainStringToId, mintclub, uncommify } from 'mint.club-v2-sdk';
import { parse } from 'valibot';
import { ValidationError } from '../../../errors/ValidationError';
import { getStatus, uploadToIpfs } from '../../../services/IpfsService';
import { COMMON_ACTIONS, NFT_ACTIONS } from '../../common/config';

import {
  ALCHEMY_BASE_API_KEY,
  ALCHEMY_OPTIMISM_API_KEY,
} from '../../../services/server-env';
import {
  Community1155Context,
  Community1155ExtraParams,
  Community1155NavigationState,
  Community1155RouteEnv,
  CommunityBaseToken,
} from '../../community-1155';
import { baseFrameNavigator } from '../../navigators/baseFrameNavigator';
import { Community1155Schema } from '../../schemas/community1155-schema';
import { CREATE_COMMUNITY1155_STEPS } from '../../steps/community1155';

export async function community1155Handler(context: Community1155Context<'/'>) {
  const { req, deriveState } = context;
  const {
    chain,
    tokenAddress,
    maxSupply: _maxSupply,
    price: _price,
  } = req.param() as {
    chain: 'base' | 'optimism';
    tokenAddress: `0x${string}`;
    maxSupply?: string;
    price?: string;
  };

  let price: number | undefined;
  let maxSupply: number | undefined;

  if (_maxSupply) {
    maxSupply = Number(uncommify(_maxSupply));
  }

  if (_price) {
    price = Number(uncommify(_price));
  }

  const previousState = deriveState();

  const extraParams: {
    chain: 'base' | 'optimism';
    price?: number;
    maxSupply?: number;
    baseToken?: CommunityBaseToken;
  } = {
    chain,
    baseToken: previousState.baseToken,
    price: previousState.price || price ? Number(price) : undefined,
    maxSupply:
      previousState.maxSupply || maxSupply ? Number(maxSupply) : undefined,
  };

  const state = deriveState((prev) => {
    if (extraParams.baseToken) prev.baseToken = extraParams.baseToken;
    if (extraParams.price) prev.price = extraParams.price;
    if (extraParams.maxSupply) prev.maxSupply = extraParams.maxSupply;
    if (extraParams.chain) prev.chain = extraParams.chain;
  });

  if (!state.baseToken) {
    extraParams.chain = chain;
    extraParams.price = price;
    extraParams.maxSupply = maxSupply;

    let alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_BASE_API_KEY}`;

    if (chain === 'optimism') {
      alchemyUrl = `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_OPTIMISM_API_KEY}`;
    }

    try {
      const resp = await fetch(alchemyUrl, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getTokenMetadata',
          params: [tokenAddress],
        }),
      });

      const {
        result: { name, symbol, decimals, logo },
      } = (await resp.json()) as {
        result: {
          name: string;
          symbol: string;
          decimals: number;
          logo: string;
        };
      };

      extraParams.baseToken = {
        address: tokenAddress,
        name,
        symbol,
        decimals,
        logo,
      };
    } catch {
      const token = mintclub.network(chain).token(tokenAddress);
      const [name, symbol, decimals] = await Promise.all([
        token.getName(),
        token.getSymbol(),
        token.getDecimals(),
      ]);

      extraParams.baseToken = {
        address: tokenAddress,
        name,
        symbol,
        decimals,
      };
    }
  }

  let path = `/${chain}/${tokenAddress}`;

  if (maxSupply) {
    path += `/${maxSupply}`;
  }

  if (price) {
    path += `/${price}`;
  }

  return baseFrameNavigator<
    Community1155ExtraParams,
    Community1155RouteEnv,
    `/${string}/${string}`,
    Community1155NavigationState
  >({
    // post url can't be too long, so after intial step, we will use the chain as the path
    path: path as `/${string}/${string}`,
    context,
    browserLocation: 'https://mint.club/create',
    extraParams,
    steps: CREATE_COMMUNITY1155_STEPS(extraParams),
    deriveState: async (previousState) => {
      const { inputText, buttonValue } = context;

      if (
        buttonValue === NFT_ACTIONS.PFP ||
        buttonValue === NFT_ACTIONS.UPLOAD
      ) {
        const imgUrl =
          buttonValue === NFT_ACTIONS.PFP
            ? context.var.interactor?.pfpUrl
            : inputText;
        const parsed = parse(Community1155Schema.entries.imageUrl, imgUrl);
        previousState.imageUrl = parsed;
      } else if (buttonValue === COMMON_ACTIONS.SET_NAME) {
        const parsed = parse(
          Community1155Schema.entries.collectionName,
          inputText,
        );
        previousState.collectionName = parsed;
      } else if (buttonValue === COMMON_ACTIONS.SET_MAX_SUPPLY) {
        const parsed = parse(Community1155Schema.entries.maxSupply, inputText);
        previousState.maxSupply = parsed;
      } else if (buttonValue === COMMON_ACTIONS.SET_FINAL_PRICE) {
        const parsed = parse(Community1155Schema.entries.price, inputText);
        previousState.price = parsed;
      } else if (buttonValue === NFT_ACTIONS.IPFS) {
        const chainId = chainStringToId(previousState.chain);
        const status = await uploadToIpfs({
          url: previousState.imageUrl!,
          collectionName: previousState.collectionName!,
          chainId,
        });
        previousState.ipfsStatus = status;
      } else if (buttonValue === COMMON_ACTIONS.REFRESH) {
        const refreshed = await getStatus(previousState.ipfsStatus?.id!);
        console.log({ refreshed });
        if (!refreshed) throw new ValidationError('IPFS status not found');
        previousState.ipfsStatus = refreshed;
        if (refreshed.status === 'SUCCESS') {
          console.log(previousState);
          //do last validation before moving to deploy step
          parse(Community1155Schema, previousState);
        }
      }
    },
  });
}
