#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if we're in a CI environment or if the user has opted out
if (process.env.CI || process.env.MXBAI_SKIP_CLI_INSTALL === 'true') {
  console.log('Skipping mxbai CLI installation');
  process.exit(0);
}

// Check if this is a local development environment (packages/cli exists)
const cliPackagePath = path.join(__dirname, '..', 'packages', 'cli');
const isLocalDev = fs.existsSync(cliPackagePath);

if (isLocalDev) {
  console.log('Local development environment detected, skipping global CLI installation');
  process.exit(0);
}

console.log('Setting up mxbai CLI...');

try {
  // Check if mxbai is already installed globally
  try {
    execSync('mxbai --version', { stdio: 'ignore' });
    console.log('mxbai CLI is already installed');
  } catch (error) {
    // mxbai is not installed, install it
    console.log('Installing mxbai CLI globally...');

    // Detect package manager
    const userAgent = process.env.npm_config_user_agent || '';
    let installCommand;

    if (userAgent.includes('yarn')) {
      installCommand = 'yarn global add @mixedbread/cli';
    } else if (userAgent.includes('pnpm')) {
      installCommand = 'pnpm add -g @mixedbread/cli';
    } else if (userAgent.includes('bun')) {
      installCommand = 'bun add -g @mixedbread/cli';
    } else {
      installCommand = 'npm install -g @mixedbread/cli';
    }

    console.log(`Running: ${installCommand}`);
    execSync(installCommand, { stdio: 'inherit' });

    console.log('\n✅ mxbai CLI has been installed successfully!');
    console.log('\nGet started with:');
    console.log('  export MXBAI_API_KEY=your_api_key');
    console.log('  mxbai --help');
  }
} catch (error) {
  console.error('\n⚠️  Failed to install mxbai CLI automatically');
  console.error('You can install it manually with:');
  console.error('  npm install -g @mixedbread/cli');
  console.error('\nError:', error.message);
  // Don't fail the installation
  process.exit(0);
}
