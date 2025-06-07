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

# List vector stores
mxbai vs list

# Create a new vector store
mxbai vs create "My Documents"

# Upload files
mxbai vs upload "My Documents" "*.md" "docs/**/*.pdf"

# Search content
mxbai vs search "My Documents" "how to get started"
```

## Commands

### Vector Store Management

- `mxbai vs list` - List all vector stores
- `mxbai vs create <name>` - Create a new vector store
- `mxbai vs get <name-or-id>` - Get vector store details
- `mxbai vs update <name-or-id>` - Update vector store
- `mxbai vs delete <name-or-id>` - Delete vector store

### File Management

- `mxbai vs upload <name-or-id> <patterns...>` - Upload files
- `mxbai vs files <name-or-id>` - List files in vector store
- `mxbai vs files get <name-or-id> <file-id>` - Get file details
- `mxbai vs files delete <name-or-id> <file-id>` - Delete file

### Search & Query

- `mxbai vs search <name-or-id> <query>` - Search vector store
- `mxbai vs qa <name-or-id> <question>` - Ask questions (coming soon)

### Advanced Features

- `mxbai vs sync <name-or-id> <patterns...>` - Sync files with change detection (coming soon)

## Authentication

The CLI looks for your API key in this order:

1. `--api-key` command line flag
2. `MXBAI_API_KEY` environment variable
3. Config file (`~/.config/mixedbread/config.json`)

## Development

This CLI is built on top of the `@mixedbread/sdk` and provides a convenient command-line interface for common operations.

## Status

This is an early version. Some advanced features like `sync` and `qa` are still in development.