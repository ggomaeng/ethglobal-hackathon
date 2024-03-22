import {
  BOND_ABI,
  SdkSupportedChainIds,
  TokenType,
  computeCreate2Address,
  getMintClubContractAddress,
  mintclub,
} from 'mint.club-v2-sdk';

export async function generateNextAvailableSymbol(params: {
  chainId: SdkSupportedChainIds;
  symbol: string;
  tokenType: TokenType;
  tryCount?: number;
}) {
  const { chainId, symbol: immutableSymbol, tokenType, tryCount = 1 } = params;
  const bondContract = getMintClubContractAddress('BOND', chainId);

  let triedSymbol = immutableSymbol;

  if (tryCount > 1) {
    triedSymbol = `${immutableSymbol}${tryCount}`;
  }

  const determinedAddress = computeCreate2Address(
    chainId,
    tokenType,
    triedSymbol,
  );

  const publicClient = mintclub.network(chainId).getPublicClient();

  const exists = await publicClient.readContract({
    address: bondContract,
    abi: BOND_ABI,
    functionName: 'exists',
    args: [determinedAddress as `0x${string}`],
  });

  if (exists) {
    return generateNextAvailableSymbol({
      chainId,
      symbol: immutableSymbol,
      tryCount: tryCount + 1,
      tokenType,
    });
  }

  return { symbol: triedSymbol, tokenAddress: determinedAddress };
}
