import { object, parse, string } from 'valibot';

const clientEnvSchema = object({
  MINTCLUB_URL: string('MINTCLUB_URL is required'),
});

export const { MINTCLUB_URL } = parse(clientEnvSchema, {
  // we have to inline the process.env for the client to properly read the variable during client build
  // https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
  MINTCLUB_URL: 'https://mint.club',
});
