# @mixedbread/cli

CLI tool for managing Mixedbread vector stores and files.

## Installation

```bash
npm install -g @mixedbread/cli
```

## Quick Start

```bash
# Set your API key
export MXBAI_API_KEY=mxb_xxxxx

## Check available commands and their options
mxbai --help

# List vector stores
mxbai vs list

# Create a new vector store
mxbai vs create "My Documents"

# Upload files
mxbai vs upload "My Documents" "*.md" "docs/**/*.pdf"

# Search content
mxbai vs search "My Documents" "how to get started"

# Sync files with change detection
mxbai vs sync "My Documents" "docs/**" --from-git HEAD~1

# Upload with manifest file
mxbai vs upload "My Documents" --manifest upload-manifest.json
```

## Commands

### Vector Store Management

- `mxbai vs list` - List all vector stores
  - Options: `--filter <name>`, `--limit <n>`
- `mxbai vs create <name>` - Create a new vector store
  - Options: `--description <desc>`, `--expires-after <days>`, `--metadata <json>`
- `mxbai vs get <name-or-id>` - Get vector store details
- `mxbai vs update <name-or-id>` - Update vector store
  - Options: `--name <name>`, `--description <desc>`, `--expires-after <days>`, `--metadata <json>`
- `mxbai vs delete <name-or-id>` - Delete vector store (alias: `rm`)
  - Options: `--force` (skip confirmation)

### File Management

- `mxbai vs upload <name-or-id> <patterns...>` - Upload files to vector store
  - Options: `--strategy fast|high_quality`, `--contextualization`, `--metadata <json>`, `--dry-run`, `--parallel <n>`, `--unique`, `--manifest <file>`
- `mxbai vs files list <name-or-id>` - List files in vector store (alias: `ls`)
  - Options: `--status <status>` (pending|in_progress|cancelled|completed|failed), `--limit <n>`
- `mxbai vs files get <name-or-id> <file-id>` - Get file details
- `mxbai vs files delete <name-or-id> <file-id>` - Delete file (alias: `rm`)
  - Options: `--force` (skip confirmation)

### Search & Query

- `mxbai vs search <name-or-id> <query>` - Search vector store
  - Options: `--top-k <n>`, `--threshold <score>`, `--return-metadata`, `--rerank`, `--show-chunks`
- `mxbai vs qa <name-or-id> <question>` - Ask questions about content
  - Options: `--top-k <n>`, `--threshold <score>`, `--return-metadata`

### Advanced Features

- `mxbai vs sync <name-or-id> <patterns...>` - Sync files with intelligent change detection
  - Options: `--strategy <strategy>`, `--from-git <ref>`, `--dry-run`, `--force`, `--metadata <json>`, `--ci`

### Configuration

- `mxbai config set <key> <value>` - Set configuration values
- `mxbai config get [key]` - Get configuration values

## Features

### Manifest-Based Upload

You can upload files using a manifest file that defines file patterns, processing strategies, and metadata:

```json
{
  "version": "1.0",
  "defaults": {
    "strategy": "fast",
    "contextualization": false,
    "metadata": {
      "project": "my-project"
    }
  },
  "files": [
    {
      "path": "docs/**/*.md",
      "metadata": {
        "category": "documentation"
      }
    },
    {
      "path": "README.md",
      "strategy": "high_quality",
      "contextualization": true,
      "metadata": {
        "importance": "high"
      }
    }
  ]
}
```

### Intelligent Sync

The sync command provides three levels of change detection:

1. **Git-based** (fastest): Uses `git diff` to detect changes
2. **Hash-based** (accurate): Compares file hashes with stored metadata
3. **Missing file detection**: Finds files that exist locally but not in vector store

### Configuration Management

Set defaults for common options:

```bash
# Upload defaults
mxbai config set defaults.upload.strategy high_quality  # or 'fast' (default: fast)
mxbai config set defaults.upload.contextualization true  # Enable context preservation (default: false)
mxbai config set defaults.upload.parallel 10             # Concurrent uploads (default: 5)

# Search defaults
mxbai config set defaults.search.top_k 20                # Number of results (default: 10)
mxbai config set defaults.search.rerank true             # Enable reranking (default: true)

# API key (alternative to environment variable)
mxbai config set api_key mxb_xxxxx

# Create aliases for frequently used vector stores
mxbai config set aliases.docs "My Documentation"
mxbai config set aliases.kb "Knowledge Base"

# Then use aliases instead of full names
mxbai vs upload docs "*.md"              # Instead of: mxbai vs upload "My Documentation" "*.md"
mxbai vs search kb "how to get started"  # Instead of: mxbai vs search "Knowledge Base" "how to get started"

# View all configuration
mxbai config get

# View specific configuration
mxbai config get defaults.upload
```

## Authentication

The CLI looks for your API key in this order:

1. `--api-key` command line flag
2. `MXBAI_API_KEY` environment variable
3. Config file (`~/.config/mixedbread/config.json`)

## Global Options

All commands support these global options:

- `--api-key <key>` - API key for authentication (must start with "mxb\_")
- `--format <format>` - Output format: table, json, or csv (default: table)
- `--debug` - Enable debug output (can also set `MXBAI_DEBUG=true`)

## Development

This CLI is built on top of the `@mixedbread/sdk` and provides a convenient command-line interface for common operations.

### Development Quick Start

#### Prerequisites

- Node.js 20+
- Yarn package manager
- Git

#### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mixedbread-ai/mixedbread-ts.git
   cd mixedbread-ts/packages/cli
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Set up your API key:**

   ```bash
   export MXBAI_API_KEY=mxb_xxxxx
   # Or create a config file
   cd packages/cli && yarn build && yarn mxbai config set api_key mxb_xxxxx
   ```

#### Development Workflow

1. **Start development mode** (auto-rebuild on changes):

   ```bash
   cd packages/cli && yarn dev
   ```

2. **In another terminal, test your changes:**

   ```bash
   yarn mxbai vs --help
   yarn mxbai vs list
   ```

3. **Run tests:**

   ```bash
   # Run all tests
   yarn test

   # Run specific test file
   yarn test tests/commands/vector-store/upload.test.ts

   # Run tests in watch mode
   yarn test --watch
   ```

4. **Lint and format:**

   ```bash
   yarn lint          # Check for issues
   yarn lint --fix    # Auto-fix issues
   yarn format        # Format code
   ```

#### Project Structure

```
src/
├── bin/mxbai.ts              # CLI entry point
├── commands/                 # All CLI commands
│   ├── config/              # Configuration commands
│   │   ├── get.ts          # Get config values
│   │   ├── set.ts          # Set config values
│   │   └── index.ts
│   └── vector-store/        # Vector store commands
│       ├── files/           # File management subcommands
│       │   ├── delete.ts
│       │   ├── get.ts
│       │   ├── list.ts
│       │   └── index.ts
│       ├── create.ts        # Create vector store
│       ├── delete.ts        # Delete vector store
│       ├── get.ts           # Get vector store details
│       ├── list.ts          # List vector stores
│       ├── qa.ts            # Q&A functionality
│       ├── search.ts        # Search functionality
│       ├── sync.ts          # Sync files
│       ├── update.ts        # Update vector store
│       ├── upload.ts        # Upload files
│       └── index.ts
├── utils/                   # Shared utilities
│   ├── client.ts           # API client setup
│   ├── config.ts           # Configuration management
│   ├── git.ts              # Git integration utilities
│   ├── global-options.ts   # Common CLI options
│   ├── hash.ts             # File hashing utilities
│   ├── manifest.ts         # Manifest file handling
│   ├── metadata.ts         # Metadata validation
│   ├── output.ts           # Output formatting
│   ├── sync-state.ts       # Sync state management
│   ├── sync.ts             # Sync logic
│   ├── upload.ts           # Upload utilities
│   └── vector-store.ts     # Vector store helpers
└── index.ts                # Package exports

tests/
├── commands/               # Command tests
├── utils/                 # Utility tests
└── __mocks__/             # Jest mocks
```

#### Adding New Commands

1. **Create command file** in `src/commands/vector-store/`:

   ```typescript
   // src/commands/vector-store/my-command.ts
   import { Command } from 'commander';
   import { addGlobalOptions } from '../../utils/global-options';

   export function createMyCommand(): Command {
     return addGlobalOptions(
       new Command('my-command')
         .description('My new command')
         .argument('<arg>', 'Required argument')
         .option('--flag', 'Optional flag'),
     ).action(async (arg, options) => {
       // Implementation
     });
   }
   ```

2. **Register command** in `src/commands/vector-store/index.ts`:

   ```typescript
   import { createMyCommand } from './my-command';

   // Add to vectorStoreCommand
   vectorStoreCommand.addCommand(createMyCommand());
   ```

3. **Add tests** in `tests/commands/vector-store/my-command.test.ts`:

   ```typescript
   import { createMyCommand } from '../../../src/commands/vector-store/my-command';

   describe('My Command', () => {
     it('should work correctly', async () => {
       // Test implementation
     });
   });
   ```

#### Debugging

- Use `--debug` flag for verbose output: `yarn mxbai --debug vs list`
- Set `MXBAI_DEBUG=true` environment variable for debug output
- Debug output includes command hierarchy options and merged options
- Tests include detailed error messages and mock setups
