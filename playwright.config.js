/**
 * Playwright config — exists to run the hero geometry lock (tests/).
 * Deliberately minimal: one browser, no parallelism, no retries. This suite
 * asserts exact layout, so a retry that "passes on the second go" would hide
 * precisely the flake worth knowing about.
 */
const { defineConfig, devices } = require('@playwright/test');

const PORT = process.env.WZ_TEST_PORT || 3100;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [['list']],
  use: {
    baseURL: process.env.WZ_TEST_URL || `http://localhost:${PORT}`,
    /* Deterministic rendering: the lock compares layout, and a device pixel
       ratio or reduced-motion difference would move type metrics. */
    ...devices['Desktop Chrome'],
    deviceScaleFactor: 1,
  },
  /* Skipped when WZ_TEST_URL points somewhere already running (a deploy). */
  webServer: process.env.WZ_TEST_URL ? undefined : {
    command: `npx serve . -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
