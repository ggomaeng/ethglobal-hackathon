import { TransactionContext } from 'frog';
import {
  BOND_ABI,
  chainStringToId,
  generateCreateArgs,
  getMintClubContractAddress,
} from 'mint.club-v2-sdk';
import { COMMON_ROUTES } from '../../common/config';
import { ERC1155NavigationState, ERC1155RouteEnv } from '../../create-erc1155';

export async function deployERC1155(
  context: TransactionContext<
    ERC1155RouteEnv,
    typeof COMMON_ROUTES.deploy,
    {},
    ERC1155NavigationState
  >,
) {
  const { previousState } = context;
  const {
    chain,
    curveType,
    maxSupply,
    baseToken,
    initialPrice,
    finalPrice,
    royalty,
    stepCount,
    collectionName,
    creatorAllocation,
    ipfsStatus,
  } = previousState;

  const chainId = chainStringToId(chain);

  const { tokenParams, bondParams } = generateCreateArgs({
    name: collectionName!,
    reserveToken: {
      address: baseToken?.address! as `0x${string}`,
      decimals: baseToken?.decimals!,
    },
    symbol: ipfsStatus?.nftSymbol!,
    tokenType: 'ERC1155',
    buyRoyalty: royalty!,
    sellRoyalty: royalty!,
    curveData: {
      curveType,
      stepCount,
      maxSupply: maxSupply!,
      initialMintingPrice: initialPrice!,
      finalMintingPrice: finalPrice!,
      creatorAllocation: creatorAllocation!,
    },
  });

  const contractChainId = `eip155:${chainId}`;

  if (
    contractChainId !== 'eip155:10' &&
    contractChainId !== 'eip155:8453' &&
    contractChainId !== 'eip155:7777777'
  ) {
    return new Response('chain not supported', { status: 400 });
  }

  const creationFee = BigInt(ipfsStatus?.creationFee!);

  console.log({
    chainId: contractChainId,
    functionName: 'createMultiToken',
    to: getMintClubContractAddress('BOND', chainId),
    args: [
      Object.assign(tokenParams, {
        uri: ipfsStatus?.ipfsHash,
      }),
      bondParams,
    ],
    value: creationFee,
  });

  return context.contract({
    abi: BOND_ABI,
    chainId: contractChainId,
    functionName: 'createMultiToken',
    to: getMintClubContractAddress('BOND', chainId),
    args: [
      Object.assign(tokenParams, {
        uri: ipfsStatus?.ipfsHash!,
      }),
      bondParams,
    ],
    value: creationFee,
  });
}
