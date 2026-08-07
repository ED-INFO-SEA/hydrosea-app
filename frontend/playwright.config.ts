import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: process.env.PREVIEW_URL ?? 'http://127.0.0.1:5173',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  outputDir: 'captures-playwright',
  reporter: 'list',
});
