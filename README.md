# Made In Frame

TODO: Description

## Dev Environment

Install [Bun](https://bun.sh/)

```sh
curl -fsSL https://bun.sh/install | bash
# or
brew install oven-sh/bun/bun

bun install
bun run dev
```

Head to http://localhost:5173

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

- 🥲 I wish it was a little more abstracted for common functions like validating all frame messages with a flag.

### Pinata 🦙

#### FDK Analytics

- 👍 I would have never thought of "Frame Analytics" if it wasn't for Pinata.

<img src='https://i.imgur.com/7sEgmDQ.png' width="100%" style="max-width:500px;">

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

- 🥲 Wish it had middleware for frog like neynar.

## TODO LIST

- [ ] allow search params to be passed
