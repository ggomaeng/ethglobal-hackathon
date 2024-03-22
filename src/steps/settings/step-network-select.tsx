/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button } from 'frog';
import { BackButton } from '../../common/Buttons';
import { NETWORKS } from '../../common/config';

export const NetworkSelectStep = {
  title: 'Select Network',
  image: (
    <div tw="relative flex flex-col items-center justify-center p-5 text-white">
      <div
        tw="flex"
        style={{
          gap: 40,
        }}
      >
        <div tw="flex flex-col items-center justify-center" style={{ gap: 8 }}>
          <div>🔵 Base</div>
          {/* <div>🟪 Polygon</div> */}
          <div>🟥 Optimism</div>
          {/* <div>🟦 Ethereum Mainnet</div> */}
        </div>
        {/* <div tw="flex flex-col" style={{ gap: 8 }}>
          <div>🟨 BNBChain</div>
          <div>🔴 Avalanche</div>
          <div>🔷 Arbitrum</div>
        </div> */}
      </div>
    </div>
  ),

  intents: [
    <BackButton />,
    <Button value={NETWORKS.BASE}>🔵 Base</Button>,
    // <Button value={polygon.id.toString()}>🟪 Polygon</Button>,
    <Button value={NETWORKS.OPTIMISM}>🟥 OP</Button>,
    // <Button value={mainnet.id.toString()}>🟦 ETH</Button>,
    // <Button value={bsc.id.toString()}>🟨 BNB</Button>,
    // <Button value={avalanche.id.toString()}>🔴 AVAX</Button>,
    // <Button value={arbitrum.id.toString()}>🔷 Arbitrum</Button>,
  ],
};
