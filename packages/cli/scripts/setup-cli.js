#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const os = require('os');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('=== Mixedbread CLI Setup ===\n');

  // Check if mxbai is already installed
  let isInstalled = false;
  try {
    const version = execSync('mxbai --version', { encoding: 'utf8' }).trim();
    console.log(`✅ mxbai CLI is already installed (${version})`);
    isInstalled = true;
  } catch (error) {
    console.log('❌ mxbai CLI is not installed');
  }

  // Install CLI if not already installed
  if (!isInstalled) {
    const install = await question('\nWould you like to install the mxbai CLI globally? (y/n): ');

    if (install.toLowerCase() === 'y') {
      console.log('\nInstalling mxbai CLI...');

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

      try {
        console.log(`Running: ${installCommand}`);
        execSync(installCommand, { stdio: 'inherit' });
        console.log('\n✅ mxbai CLI installed successfully!');
      } catch (error) {
        console.error('\n❌ Failed to install mxbai CLI');
        console.error('Please try installing manually with:');
        console.error('  npm install -g @mixedbread/cli');
        rl.close();
        process.exit(1);
      }
    } else {
      console.log('\nYou can install it later with:');
      console.log('  npm install -g @mixedbread/cli');
    }
  }

  // Check for API key
  console.log('\n=== API Key Configuration ===\n');

  const envApiKey = process.env.MXBAI_API_KEY;
  const configPath = path.join(os.homedir(), '.config', 'mixedbread', 'config.json');
  let configApiKey = null;

  try {
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      configApiKey = config.api_key;
    }
  } catch (error) {
    // Ignore config read errors
  }

  if (envApiKey) {
    console.log('✅ API key found in environment variable MXBAI_API_KEY');
  } else if (configApiKey) {
    console.log('✅ API key found in config file');
  } else {
    console.log('❌ No API key configured');

    const configure = await question('\nWould you like to configure your API key now? (y/n): ');

    if (configure.toLowerCase() === 'y') {
      const apiKey = await question('Enter your Mixedbread API key (starts with mxb_): ');

      if (apiKey && apiKey.startsWith('mxb_')) {
        const saveLocation = await question(
          '\nWhere would you like to save the API key?\n1. Environment variable (add to shell profile)\n2. Config file (~/.config/mixedbread/config.json)\n3. Both\nEnter choice (1-3): ',
        );

        // Save to config file
        if (saveLocation === '2' || saveLocation === '3') {
          try {
            const configDir = path.dirname(configPath);
            if (!fs.existsSync(configDir)) {
              fs.mkdirSync(configDir, { recursive: true });
            }

            let config = {};
            if (fs.existsSync(configPath)) {
              config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            }

            config.api_key = apiKey;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            console.log('\n✅ API key saved to config file');
          } catch (error) {
            console.error('❌ Failed to save to config file:', error.message);
          }
        }

        // Show environment variable instructions
        if (saveLocation === '1' || saveLocation === '3') {
          console.log('\n📝 To set the environment variable, add this to your shell profile:');
          console.log(`export MXBAI_API_KEY="${apiKey}"`);
          console.log('\nCommon shell profile locations:');
          console.log('  ~/.bashrc (Bash)');
          console.log('  ~/.zshrc (Zsh)');
          console.log('  ~/.config/fish/config.fish (Fish)');
        }
      } else {
        console.log('\n❌ Invalid API key format. API keys should start with "mxb_"');
      }
    }
  }

  // Show next steps
  console.log('\n=== Next Steps ===\n');

  if (isInstalled || install?.toLowerCase() === 'y') {
    console.log('Get started with the mxbai CLI:');
    console.log('  mxbai --help              # Show all commands');
    console.log('  mxbai vs list             # List your vector stores');
    console.log('  mxbai vs create "My Docs" # Create a new vector store');
    console.log('  mxbai config get          # View configuration');

    console.log('\nUseful resources:');
    console.log('  📚 Documentation: https://mixedbread.ai/docs/cli');
    console.log('  🔑 Get API key: https://mixedbread.ai/dashboard/api-keys');
  }

  rl.close();
}

main().catch((error) => {
  console.error('Setup failed:', error);
  rl.close();
  process.exit(1);
});
