/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

// frog documentation
// https://frog.fm/platforms/next
import { Button, Frog } from 'frog';
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';
import { readFile } from 'fs/promises';
import { Logger } from '../utils/Logger';
import { startProxy } from '../utils/proxy';
import { ASSETS_PATH, BASE_FRAMES_PATH } from './common/config';
import { app as erc1155 } from './create-erc1155';
import { app as erc20 } from './create-erc20';
import { getFrameHtml } from 'frames.js';

declare global {
  var cloudflared: string | undefined;
}

if (process.env.PROXY === 'true' && !globalThis.cloudflared) {
  const cloudflared = await startProxy();
  globalThis.cloudflared = cloudflared;
}

const rootDir = process.cwd();

async function getFonts() {
  const Bebas = await readFile(`${rootDir}/fonts/BebasNeue-Regular.ttf`);
  const Roboto = await readFile(`${rootDir}/fonts/Roboto-Regular.ttf`);

  return [
    {
      name: 'bebas',
      data: Bebas,
      weight: 400,
    } as const,
    {
      name: 'roboto',
      data: Roboto,
      weight: 400,
    } as const,
  ];
}

type RootState = {
  error?: string;
};

const origin =
  process.env.PROXY && globalThis.cloudflared !== undefined
    ? globalThis.cloudflared
    : process.env.NODE_ENV === 'development'
      ? `http://localhost:${process.env.PORT}`
      : 'https://mint.club';

export const app = new Frog<{
  State: RootState;
}>({
  verify: 'silent',
  assetsPath: ASSETS_PATH,
  basePath: BASE_FRAMES_PATH,
  origin,
  imageOptions: {
    format: 'png',
    height: 600,
    width: 600,
    // debug: true,
    fonts: await getFonts(),
  },
});

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

app.use(async (c, next) => {
  Logger.info(`[${c.req.method}] ${new URL(c.req.url).pathname}`);
  await next();
});

app.frame('/', async (c) => {
  return c.res({
    imageAspectRatio: '1:1',
    browserLocation: 'https://mint.club',
    image: 'https://i.imgur.com/7Sww7lT.gif',
    intents: [
      <Button action="/erc20">🪙 Deploy ERC-20</Button>,
      <Button action="/erc1155">🖼️ Deploy ERC-1155</Button>,
    ],
  });
});

app.route('/erc1155', erc1155);
app.route('/erc20', erc20);

if (typeof Bun !== 'undefined') {
  app.get(
    '/assets/*',
    (await import('hono/bun')).serveStatic({
      root: './',
      rewriteRequestPath: (path) => {
        return path.replace(/^\/frames\/assets/, '/public/assets');
      },
    }),
  );
  const port = process.env.PORT || 8880;
  Bun.serve({
    fetch: app.fetch,
    port,
  });
  console.log(`Server is running on http://localhost:${port}/frames`);
} else {
  devtools(app, { serveStatic });
}
