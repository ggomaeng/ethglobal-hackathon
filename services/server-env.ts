import dotenv from 'dotenv';
import { object, optional, parse, string } from 'valibot';

dotenv.config();

const envSchema = object({
  TEMP_DIR: optional(string('TEMP_DIR is required')),
  MCV2_AWS_ACCESS_KEY: string('MCV2_AWS_ACCESS_KEY is required'),
  MCV2_AWS_SECRET_KEY: string('MCV2_AWS_SECRET_KEY is required'),
  NEYNAR_API_KEY: string('NEYNAR_API_KEY is required'),
  FILEBASE_API_KEY: string('FILEBASE_API_KEY is required'),
});

export const {
  TEMP_DIR,
  MCV2_AWS_ACCESS_KEY,
  MCV2_AWS_SECRET_KEY,
  NEYNAR_API_KEY,
  FILEBASE_API_KEY,
} = parse(envSchema, process.env);
