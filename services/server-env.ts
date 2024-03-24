import dotenv from 'dotenv';
import { object, optional, parse, string } from 'valibot';

dotenv.config();

const envSchema = object({
  TEMP_DIR: optional(string('TEMP_DIR is required')),
  MCV2_AWS_ACCESS_KEY: string('MCV2_AWS_ACCESS_KEY is required'),
  MCV2_AWS_SECRET_KEY: string('MCV2_AWS_SECRET_KEY is required'),
  NEYNAR_API_KEY: string('NEYNAR_API_KEY is required'),
  PINATA_API_KEY: string('PINATA_API_KEY is required'),
  PINATA_API_SECRET: string('PINATA_API_SECRET is required'),
  PINATA_API_JWT: string('PINATA_API_JWT is required'),
  FROG_SECRET: string('FROG_SECRET is required'),
  ALCHEMY_BASE_API_KEY: string('ALCHEMY_BASE_API_KEY is required'),
  ALCHEMY_OPTIMISM_API_KEY: string('ALCHEMY_OPTIMISM_API_KEY is required'),
});

export const {
  TEMP_DIR,
  MCV2_AWS_ACCESS_KEY,
  MCV2_AWS_SECRET_KEY,
  NEYNAR_API_KEY,
  PINATA_API_KEY,
  PINATA_API_SECRET,
  PINATA_API_JWT,
  FROG_SECRET,
  ALCHEMY_BASE_API_KEY,
  ALCHEMY_OPTIMISM_API_KEY,
} = parse(envSchema, process.env);
