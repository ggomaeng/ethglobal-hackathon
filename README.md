# Mint.club Frames 🟪

> Reach me at [@undefined](https://warpcast.com/undefined) on Warpcast if you have any questions!

![Flow](https://github.com/ggomaeng/ethglobal-hackathon/blob/main/public/mintclubframes.drawio.png?raw=true)

## Running it locally 🚀

Install [Bun](https://bun.sh/)

```sh
curl -fsSL https://bun.sh/install | bash
# or
brew install oven-sh/bun/bun

bun install
# set up .env with .env.example
bun run dev
```

Head to http://localhost:8880/frames

## What did we make? ⚡

- [x] Launch an ERC-20 with automated price curve through frames. [example](https://warpcast.com/~/developers/frames?url=https%3A%2F%2Fmint.club%2Fframes%2Ferc20)

- [x] Launch an ERC-1155 with automated price curve through frames. [example](https://warpcast.com/~/developers/frames?url=https%3A%2F%2Fmint.club%2Fframes%2Ferc1155)

- [x] Launch a community ERC-1155 token with base asset predefined through frames. [example](https://warpcast.com/~/developers/frames?url=https%3A%2F%2Fmint.club%2Fframes%2Fcommunity1155%2Fbase%2F0x4ed4e862860bed51a9570b96d89af5e1b0efefed)

## Built with 🔨

### Pinata & Frog & Frames.js

Built with a mix of Pinata & Frog & Frames.js 🐸🖼️

I believe each framework has its own strengths, and I wanted to leverage the best of all the worlds.

### 🐸 Frog

- 👍 More abstraction. (double edged sword though)
- 👍 Bun support.
- 👍 Community middlewares.
- 🥲 Lack of `getFrameHtml` and `XMTP` support & utility functions.

### 🖼️ Frames.js

- 👍 Super powerful debugger. Always debugged with frames.js.
- 👍 Helpful utility functions like `getFrameHtml` & `getFrameFlattened`, which is useful for handling unexpected errors.
- 👍 Supports XMTP! `getXmtpFrameMessage`

> We use `getFrame` and `getFrameFlattened` on our separate front-end code, which is a huge life saver.

```ts
const other: Metadata['other'] = {
  'fc:frame': 'vNext',
  'fc:frame:image': ogUrl,
  ...farcasterMetadata,
};

const url = `https://mint.club/frames/buysell/preview/${contractType}-${chain}-${symbolOrAddress}`;

const htmlString = await ky(url)
  .text()
  .catch((e) => {
    Logger.error(e);
    return null;
  });

if (htmlString) {
  const { frame } = getFrame({
    htmlString: htmlString,
    url,
  });

  if (frame) {
    const flattened = getFrameFlattened(frame);
    Object.assign(other, flattened);
  }
}
```

> Also for handling unexpected errors

```ts
app.hono.onError((error, c) => {
  console.error(error);
  const html = getFrameHtml({
    version: 'vNext',
    postUrl: `${origin}/frames`,
    image: `${origin}/frames/assets/error.png`,
    imageAspectRatio: '1:1',
    buttons: [
      {
        action: 'post',
        label: 'Go back',
      },
    ],
  });

  return c.html(html);
});
```

- 🥲 I wish it was a little more abstracted for common functions like validating all frame messages with a flag.

> I tried implementing XMTP in frog, but it seems like it's a bigger obstacle than I thought :c

### Pinata 🦙

#### FDK Analytics

- 👍 I would have never thought of "Frame Analytics" if it wasn't for Pinata.

<img src='https://i.imgur.com/GS07gsT.png' width="100%" style="max-width:500px;">

```ts
app.use(
  '/erc1155',
  fdk.analyticsMiddleware({
    frameId: 'erc1155',
  }),
);

app.use(
  '/erc20',
  fdk.analyticsMiddleware({
    frameId: 'erc20',
  }),
);
```

#### Pinata IPFS SDK

- 👍 All the data (bonding curve data, image, metadata) lives on-chain.

<img src='https://i.imgur.com/3Dgatx9.png' width="100%" style="max-width:500px;">

- 🥲 Wish it had middleware for frog like neynar.

```ts
// PinataService.ts
import fetch from 'node-fetch';
import { PINATA_API_JWT } from './server-env';

export async function uploadToPinata(blob: Blob) {
  const data = new FormData();
  data.append('file', blob);

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_API_JWT}`,
    },
    body: data,
  });

  const { IpfsHash } = (await res.json()) as {
    IpfsHash: string;
  };
  return `ipfs://${IpfsHash}`;
}

export async function uploadMetadataToPinata(
  imageHash: `ipfs://${string}`,
  name: string,
) {
  const defaultExternalLink = `https://mint.club`;
  const defaultDescription = [
    `A Bonding Curved ERC-1155 token powered by mint.club bonding curve protocol.`,
    defaultExternalLink,
  ].join('\n\n');

  const finalMetadata = {
    name,
    description: defaultDescription,
    image: imageHash,
    external_url: defaultExternalLink,
    attributes: [],
  };

  const metadata = JSON.stringify(finalMetadata);
  const metadataBuffer = new File([metadata], 'metadata.json', {
    type: 'application/json',
  });
  return uploadToPinata(metadataBuffer);
}
```
