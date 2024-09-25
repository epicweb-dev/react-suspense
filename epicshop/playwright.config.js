import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, devices } from '@playwright/test'

const PORT = process.env.PORT || '3742'
const tmpDir = path.join(
	os.tmpdir(),
	'epicshop-playwright',
	path.basename(new URL('../', import.meta.url).pathname),
)

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	workers: process.env.CI ? 1 : undefined,
	outputDir: path.join(tmpDir, 'playwright-test-output'),
	reporter: [
		[
			'html',
			{ open: 'never', outputFolder: path.join(tmpDir, 'playwright-report') },
		],
	],
	use: {
		baseURL: `http://localhost:${PORT}/`,
		trace: 'retain-on-failure',
		// Some errors are expected, e.g. when a ship is not found
		ignoreHTTPSErrors: true,
		contextOptions: {
			ignoreHTTPErrors: true,
		},
		// ignore 404 errors for resources
		bypassCSP: true,
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	webServer: {
		command: 'npm start',
		cwd: path.resolve(__dirname, '..'),
		port: Number(PORT),
		reuseExistingServer: !process.env.CI,
		stdout: 'pipe',
		stderr: 'pipe',
		env: { PORT },
	},
})
