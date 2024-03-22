import { execSync, spawn } from 'child_process';
import pc from 'picocolors';
import { createLogger } from 'vite';
const logger = createLogger();

export async function startProxy() {
  return new Promise<string>((resolve, reject) => {
    try {
      const proxyLogPrefix = `  ${pc.green('➜')}  ${pc.bold('Proxy')}:   `;
      const cloudflaredBin = execSync('which cloudflared', {
        encoding: 'utf8',
      }).trim();

      const basePath = `http://localhost:${process.env.PORT}`;

      const child = spawn(cloudflaredBin, ['tunnel', '--url', basePath]);

      // proxy url regex
      // https://regexr.com/7spe1
      const proxyUrlRegex = /https:\/\/.*.trycloudflare.com/;

      // cloudflare diagnostic info logged to stderr
      child.stderr.on('data', (data) => {
        if (proxyUrlRegex.test(data)) {
          const match = data.toString().match(proxyUrlRegex);
          const proxyUrl = match?.[0];
          if (proxyUrl) {
            logger.info(`${proxyLogPrefix} -> ${pc.cyan(proxyUrl)}`);
            resolve(proxyUrl);
          }
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}
