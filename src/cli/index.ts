#!/usr/bin/env node

import { Command } from 'commander';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const program = new Command();

program
  .name('x-draft')
  .description('A drafting CLI tool for X (Twitter) to create tweets that perform well')
  .version('1.0.0');

program.parse();
