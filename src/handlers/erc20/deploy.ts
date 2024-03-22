import { TransactionContext } from 'frog';
import {
  BOND_ABI,
  chainStringToId,
  generateCreateArgs,
  getMintClubContractAddress,
  mintclub,
} from 'mint.club-v2-sdk';
import { COMMON_ROUTES } from '../../common/config';
import { ERC20NavigationState, ERC20RouteEnv } from '../../create-erc20';

export async function deployERC20(
  context: TransactionContext<
    ERC20RouteEnv,
    typeof COMMON_ROUTES.deploy,
    {},
    ERC20NavigationState
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
    name,
    symbol,
    creatorAllocation,
  } = previousState;

  const chainId = chainStringToId(chain);

  const { tokenParams, bondParams } = generateCreateArgs({
    name: name!,
    reserveToken: {
      address: baseToken?.address! as `0x${string}`,
      decimals: baseToken?.decimals!,
    },
    symbol,
    tokenType: 'ERC20',
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

  const creationFee = await mintclub.network(chain).bond.getCreationFee();

  console.log({
    chainId: contractChainId,
    functionName: 'createMultiToken',
    to: getMintClubContractAddress('BOND', chainId),
    args: [tokenParams, bondParams],
    value: creationFee,
  });

  return context.contract({
    abi: BOND_ABI,
    chainId: contractChainId,
    functionName: 'createToken',
    to: getMintClubContractAddress('BOND', chainId),
    args: [tokenParams, bondParams],
    value: creationFee,
  });
}
