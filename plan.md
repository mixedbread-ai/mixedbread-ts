# Mixedbread CLI Plan

## Overview

A cross-platform CLI tool for managing Mixedbread vector stores and files, designed to simplify common workflows and enable automation.

## Core Design Principles

1. **SDK-based**: Built on top of the existing TypeScript/Python SDK to ensure consistency
2. **Cross-platform**: Works on Windows, macOS, and Linux  
3. **Interactive & Scriptable**: Supports both interactive prompts and direct command execution
4. **Configuration-based**: Uses config files for repeated operations
5. **Progress Feedback**: Clear status updates for long-running operations
6. **Name-based Access**: Support vector store names as identifiers, not just IDs

## Quick Start

```bash
# No setup required - just use your API key
mxbai vs list --api-key mxb_xxxxx

# Or set it once in your environment
export MXBAI_API_KEY=mxb_xxxxx
mxbai vs list

# Or save it in config (optional)
mxbai config set api_key mxb_xxxxx
mxbai vs list
```

## Command Structure

### Configuration (Optional)

```bash
# Show current configuration
mxbai config

# Update configuration
mxbai config set <key> <value>  # e.g., defaults.strategy high_quality
mxbai config get <key>
```

**Note**: Every command supports `--api-key` flag for authentication:
```bash
mxbai vs list --api-key mxb_xxxxx
```

### Vector Store Management

```bash
# List vector stores
mxbai vs list
  [--filter <name>]
  [--limit <n>]
  [--format <table|json|csv>]

# Create vector store
mxbai vs create <name>
  [--description <desc>]
  [--expires-after <days>]
  [--metadata <json>]

# Get vector store details
mxbai vs get <name-or-id>
  [--format <table|json>]

# Update vector store
mxbai vs update <name-or-id>
  [--name <new-name>]
  [--description <desc>]
  [--metadata <json>]

# Delete vector store
mxbai vs delete <name-or-id>
  [--force]  # Skip confirmation

# Select vector store interactively
mxbai vs select
  [--set-default]  # Save as default for session
```

### File Management

```bash
# Upload files to vector store
mxbai vs upload <name-or-id> <pattern> [...patterns]
  [--strategy <fast|high_quality>]  # Default: fast
  [--contextualization]              # Enable context preservation
  [--metadata <json>]                # File metadata
  [--dry-run]                        # Preview what would be uploaded
  [--parallel <n>]                   # Concurrent uploads (default: 5)
  [--unique]                         # Update existing files instead of creating new

# Examples:
# mxbai vs upload "My Docs" "*.md"                    # All .md files in current dir
# mxbai vs upload "My Docs" "docs/**/*.md"            # All .md files recursively
# mxbai vs upload "My Docs" "*.pdf" "data/*.json"    # Multiple patterns
# mxbai vs upload "My Docs" "report.pdf"              # Single specific file

# Upload using manifest file
mxbai vs upload <name-or-id> --manifest <manifest.yaml>
  [--dry-run]
  [--continue-on-error]
  [--unique]

# List files in vector store
mxbai vs files <name-or-id>
  [--status <all|completed|in_progress|failed>]
  [--limit <n>]
  [--format <table|json|csv>]

# Get file details
mxbai vs files get <name-or-id> <file-id>

# Delete file from vector store
mxbai vs files delete <name-or-id> <file-id>
  [--force]

# Monitor file processing status
mxbai vs files status <name-or-id> <file-id>
  [--wait]           # Wait for completion
  [--poll-interval]  # Seconds between checks
```

### Manifest File Format

```yaml
# Example manifest.yaml for bulk uploads
defaults:
  strategy: high_quality
  contextualization: true
files:
  - path: ./docs/**/*.md
    metadata: 
      type: "documentation"
      version: "1.0"
  - path: ./data/products.json
    metadata: 
      type: "product_data"
    strategy: fast  # Override default
  - path: ./images/*.png
    metadata:
      type: "screenshots"
```

### Search & Query

```bash
# Search within vector store
mxbai vs search <name-or-id> <query>
  [--top-k <n>]           # Number of results (default: 10)
  [--threshold <score>]   # Minimum score
  [--filter <json>]       # Metadata filters
  [--rerank]              # Enable reranking
  [--show-chunks]         # Display matching chunks
  [--format <table|json>]

# Question answering
mxbai vs qa <name-or-id> <question>
  [--model <model-name>]
  [--temperature <n>]
  [--max-tokens <n>]
  [--format <text|json>]
```

### Utility Commands

```bash
# Watch directory for changes and auto-upload
mxbai vs watch <name-or-id> <directory>
  [--pattern <glob>]
  [--strategy <fast|high_quality>]
  [--debounce <seconds>]  # Wait before upload
  [--daemon]              # Run in background

# Sync files with vector store (intelligent change detection)
mxbai vs sync <name-or-id> <pattern> [...patterns]
  [--strategy <fast|high_quality>]
  [--from-git <commit/branch>]      # Compare against git ref (default: last sync)
  [--dry-run]                       # Show what would change
  [--force]                         # Skip confirmation
  [--metadata <json>]               # Additional metadata
  [--ci]                            # Non-interactive mode for CI/CD

# Examples:
# mxbai vs sync "My Docs" "docs/**/*.md"
# mxbai vs sync "My Docs" "*.md" "examples/*.js"
# mxbai vs sync "My Docs" "content/**/*" --from-git HEAD~5

# Show usage statistics
mxbai usage
  [--period <daily|weekly|monthly>]
  [--vector-store <name-or-id>]
  [--format <table|json|csv>]
```


## File Upload Behavior: --unique Flag

By default, every upload creates a **new** file in the vector store (even if the same file was uploaded before). The `--unique` flag changes this behavior:

### Default Behavior (without --unique)
```bash
mxbai vs upload "My Docs" "readme.md"  # Creates file_abc123
mxbai vs upload "My Docs" "readme.md"  # Creates file_def456 (duplicate)
```

### With --unique Flag
```bash
mxbai vs upload "My Docs" "readme.md" --unique  # Creates or updates based on path
```

When using `--unique`, files are identified by their path in metadata. If a file with the same `file_path` exists, it will be:
1. Deleted (the old version)
2. Re-uploaded (the new version)

This ensures you always have exactly one version of each file.

## Change Tracking & Sync

The `sync` command is built on top of `upload --unique` but adds intelligent change detection to minimize API calls and processing time.

### Use Cases

- **Documentation Sites**: Keep search in sync with your docs
- **Knowledge Bases**: Update when content changes  
- **Code Search**: Track API changes and code examples
- **Content Management**: Sync CMS content automatically

### How Sync Works

#### 1. Initial Sync
On first sync, all files are uploaded with metadata:
```json
{
  "file_path": "docs/guide.md",
  "file_hash": "sha256:abc123...",
  "git_commit": "a1b2c3d",
  "git_branch": "main",
  "uploaded_at": "2024-01-20T10:00:00Z",
  "synced": true
}
```

#### 2. Change Detection Strategy

The sync command uses multiple strategies to detect changes:

**A. Git-Based Detection (when in git repo)**
```bash
# Detect changes since last sync
git diff --name-only <last-sync-commit> HEAD -- <patterns>

# Get file status (added/modified/deleted)
git diff --name-status <last-sync-commit> HEAD -- <patterns>
```

**B. Hash-Based Detection (always used)**
1. List all files in vector store with `synced: true` metadata
2. Calculate SHA-256 hash of local files
3. Compare with stored `file_hash` metadata
4. Mark changed files for update

**C. Missing File Detection**
1. Get all synced files from vector store
2. Check if local files still exist
3. Mark missing files for deletion

#### 3. Sync Process

```
1. List existing files in vector store (filtered by synced=true)
2. Build map of file_path -> file_id and metadata
3. Scan local files matching patterns
4. For each local file:
   - If new (not in map): mark for upload
   - If exists: compare hash/git status
     - If changed: mark for update (delete old + upload new)
     - If unchanged: skip
5. For each vector store file not found locally:
   - Mark for deletion
6. Execute changes:
   - Delete removed/changed files
   - Upload new/changed files with metadata
```

### Detailed Sync Examples

#### Basic Sync
```bash
# First time - uploads all files
mxbai vs sync "Documentation" "docs/**/*.md"

# Second time - only uploads changes
mxbai vs sync "Documentation" "docs/**/*.md"
# Output: 2 files updated, 1 file added, 0 files removed
```

#### Git-Aware Sync
```bash
# Sync changes since specific commit
mxbai vs sync "Documentation" "docs/**/*.md" --from-git v1.0.0

# Sync changes in current branch vs main
mxbai vs sync "Documentation" "docs/**/*.md" --from-git origin/main
```

#### Sync State Storage

The last sync state is stored in vector store metadata:
```json
{
  "_sync_state": {
    "last_sync": "2024-01-20T10:00:00Z",
    "git_commit": "a1b2c3d",
    "git_branch": "main",
    "file_count": 145,
    "patterns": ["docs/**/*.md"]
  }
}
```

### GitHub Actions Example

```yaml
name: Update Documentation Search
on:
  push:
    branches: [main]
    paths:
      - 'docs/**'

jobs:
  sync-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2  # Need previous commit for diff
      
      - name: Sync docs to Mixedbread
        env:
          MXBAI_API_KEY: ${{ secrets.MXBAI_API_KEY }}
        run: |
          npx @mixedbread/cli vs sync "Documentation" "docs/**/*.md" \
            --ci \
            --metadata '{"branch": "${{ github.ref_name }}", "commit": "${{ github.sha }}"}'
```

### Real-World Examples

#### Docusaurus/Next.js Documentation
```bash
# Initial setup
mxbai vs create "Product Docs" --description "Product documentation search"

# First sync
mxbai vs sync "Product Docs" "docs/**/*.{md,mdx}"

# Subsequent syncs (only changed files)
mxbai vs sync "Product Docs" "docs/**/*.{md,mdx}"
```

#### Vercel/Netlify Deploy Hook
```bash
# In your build script
mxbai vs sync "Docs" "content/**/*.md" \
  --ci \
  --metadata '{"deploy_id": "$VERCEL_URL", "git_branch": "$VERCEL_GIT_COMMIT_REF"}'
```

#### Manual Sync Examples

```bash
# Preview what would change
mxbai vs sync "My Docs" "docs/**/*.md" --dry-run

# Sync only files changed since last commit
mxbai vs sync "My Docs" "docs/**/*.md" --from-git HEAD~1

# Force sync all files (ignore change detection)
mxbai vs sync "My Docs" "docs/**/*" --force

# Sync with custom metadata
mxbai vs sync "My Docs" "docs/**/*.md" \
  --metadata '{"version": "1.2.0", "environment": "production"}'

# Sync multiple patterns
mxbai vs sync "Knowledge Base" "docs/**/*.md" "api/**/*.json" "examples/**/*.js"
```

### Sync Output Example

```
Syncing "Documentation" vector store...
Patterns: docs/**/*.md

Analyzing changes...
✓ Found 145 existing files in vector store
✓ Detected changes using git (from commit a1b2c3d)
✓ Computed file hashes for verification

Changes to apply:
  Updated: (6 files)
    • docs/api/authentication.md (2.3 KB)
    • docs/api/endpoints.md (5.1 KB)
    • docs/guides/quickstart.md (3.2 KB)
    • docs/guides/advanced.md (4.5 KB)
    • docs/reference/errors.md (1.8 KB)
    • docs/changelog.md (2.1 KB)
  
  New: (2 files)
    • docs/api/webhooks.md (3.4 KB)
    • docs/guides/migration.md (2.8 KB)
  
  Deleted: (2 files)
    • docs/api/deprecated.md
    • docs/guides/old-setup.md

Total: 10 changes (8 files to upload, 8 files to delete)
Upload size: 25.2 KB

Proceed? (y/N) y

Syncing...
[████████████████████████] 8/8 files • 100% • ✓ Complete

Summary:
✓ 8 files uploaded successfully
✓ 8 files deleted (6 updates + 2 removals)
✓ Vector store is now in sync
✓ Sync state saved (commit: def456, patterns: docs/**/*.md)
```

### Edge Cases & Behavior

#### File Identity with --unique

The `--unique` flag uses `file_path` metadata to identify files:

```bash
# Without --unique: Always creates new file
mxbai vs upload "Docs" "readme.md"           # Creates file_123
mxbai vs upload "Docs" "readme.md"           # Creates file_456 (duplicate)

# With --unique: Updates based on path
mxbai vs upload "Docs" "readme.md" --unique  # Creates file_789 with metadata {"file_path": "readme.md"}
mxbai vs upload "Docs" "readme.md" --unique  # Deletes file_789, creates file_012 (replacement)
```

#### Sync vs Upload --unique

```bash
# Upload --unique: Simple replacement, no change detection
mxbai vs upload "Docs" "**/*.md" --unique
# Always re-uploads ALL matching files

# Sync: Smart change detection
mxbai vs sync "Docs" "**/*.md"
# Only uploads files that actually changed
```

#### Multiple Sync Patterns

When syncing with multiple patterns, each file is tracked individually:

```bash
# First sync
mxbai vs sync "Docs" "docs/**/*.md" "api/**/*.json"
# Uploads: 50 .md files, 10 .json files

# Later, sync only markdown
mxbai vs sync "Docs" "docs/**/*.md"
# Only tracks .md files, ignores .json files
# Won't delete .json files (they're not in the sync scope)

# To remove files, must sync with same patterns
mxbai vs sync "Docs" "docs/**/*.md" "api/**/*.json"
# Now it can detect if any .json files were deleted
```

## Configuration

Configuration is optional but can improve your workflow.

Location: `~/.config/mixedbread/config.json`

```json
{
  "version": "1.0",
  "api_key": "mxb_xxxxx",  // Optional: avoid using --api-key every time
  "defaults": {
    "upload": {
      "strategy": "fast",
      "contextualization": false,
      "parallel": 5
    },
    "search": {
      "top_k": 10,
      "rerank": true
    }
  },
  "aliases": {
    "docs": "Product Documentation",
    "kb": "Knowledge Base"
  }
}
```

### Authentication Priority

The CLI looks for API keys in this order:
1. Command line flag: `--api-key mxb_xxxxx`
2. Environment variable: `MXBAI_API_KEY`
3. Config file: `~/.config/mixedbread/config.json`

If no API key is found, the CLI will show an error with instructions.

### Environment Variables

```bash
# Authentication
MXBAI_API_KEY=mxb_xxxxx               # API key

# Optional overrides
MXBAI_BASE_URL=https://api.mixedbread.ai  # Custom API endpoint (e.g., for self-hosted)
MXBAI_CONFIG_PATH=~/.config/mixedbread    # Custom config location
MXBAI_DEBUG=true                          # Enable debug logging
```

## Output Formats

### Table (Default)

```
┌─────────────────────────┬──────────┬───────────┬─────────────┐
│ Name                    │ Status   │ Files     │ Usage       │
├─────────────────────────┼──────────┼───────────┼─────────────┤
│ Product Documentation   │ active   │ 145       │ 1.2 GB      │
│ Knowledge Base          │ active   │ 89        │ 856 MB      │
│ Customer Support        │ expired  │ 0         │ 0 B         │
└─────────────────────────┴──────────┴───────────┴─────────────┘
```

### JSON (--format json)

```json
{
  "vector_stores": [
    {
      "name": "Product Documentation",
      "id": "vs_abc123",
      "status": "active",
      "file_count": 145,
      "usage_bytes": 1288490188
    }
  ]
}
```

### Progress Indicators

```
Uploading files to "Product Documentation"...
[████████████████████████░░░░░░] 4/5 files • 80% • ETA: 12s
✓ manual.pdf (2.3 MB)
✓ guide.pdf (1.8 MB)  
✓ reference.docx (956 KB)
✓ readme.md (12 KB)
⠼ tutorial.mp4 (45 MB) - Processing...
```

## Error Handling

### User-Friendly Error Messages

```
Error: No API key found.

Please provide your API key using one of these methods:
  1. Command flag: --api-key mxb_xxxxx
  2. Environment variable: export MXBAI_API_KEY=mxb_xxxxx
  3. Config file: mxbai config set api_key mxb_xxxxx

Get your API key at: https://www.platform.mixedbread.com/platform?next=api-keys
```

```
Error: Vector store "Product Docs" not found.

Did you mean one of these?
  • Product Documentation
  • Product Updates
  
Run 'mxbai vs list' to see all vector stores.
```

### Debug Mode

```bash
# Enable debug output
mxbai --debug vs upload "My Store" ./files

# Or via environment
MXBAI_DEBUG=true mxbai vs list
```

## Distribution

### Installation Methods

1. **npm/yarn** (Primary)
   ```bash
   npm install -g @mixedbread/cli
   ```

2. **Homebrew** (macOS/Linux)
   ```bash
   brew install mixedbread/tap/mxbai
   ```

3. **Direct Download** (All platforms)
   - Standalone binaries for Windows, macOS, Linux

### Package Structure

```
@mixedbread/cli/
├── bin/
│   └── mxbai          # Entry point
├── dist/
│   ├── commands/      # Command implementations
│   ├── utils/         # Shared utilities
│   └── index.js       # Main CLI setup
├── templates/         # Built-in templates
└── package.json
```

## Implementation Phases

### Phase 1: Core Functionality (MVP)
- [ ] Basic vector store operations (create, list, get, delete)
- [ ] File upload (single and multiple files)
- [ ] Basic search functionality
- [ ] Progress tracking for uploads
- [ ] Configuration support

### Phase 2: Enhanced Features
- [ ] **Sync command with change tracking**
- [ ] Git integration for change detection
- [ ] Manifest-based uploads
- [ ] Watch mode for auto-upload
- [ ] Multiple output formats (JSON, CSV)
- [ ] File filtering and status tracking
- [ ] Question answering support

### Phase 3: Polish & Extensions
- [ ] Interactive mode with autocomplete
- [ ] Better error messages with suggestions
- [ ] Usage statistics
- [ ] Aliases for vector stores

## Technology Stack Recommendation

### Language: TypeScript
**Why TypeScript:**
- Reuse existing TypeScript SDK without reimplementing API calls
- Node.js is ubiquitous - most developers already have it installed
- Can be distributed as npm package OR standalone binaries
- Excellent ecosystem for CLI tools
- Type safety catches errors early

### CLI Framework Options

**Recommended: Commander.js**
- Mature, battle-tested (used by Vue CLI, Create React App)
- Simple API, easy to learn
- Great TypeScript support
- Supports subcommands naturally
- 5.8M weekly downloads

**Alternative: Oclif (by Salesforce)**
- More opinionated, full-featured framework
- Built-in plugin system
- Automatic documentation generation
- Better for complex CLIs with many commands
- Used by Heroku CLI, Salesforce CLI

**Why not others:**
- **Yargs**: More complex API, overkill for our needs
- **Ink**: React-based, better for interactive UIs (could use later)
- **Cliffy**: Deno-based, limits distribution options

### Key Dependencies
```json
{
  "@mixedbread/sdk": "^1.0.0",      // Existing SDK
  "commander": "^12.0.0",           // CLI framework
  "chalk": "^5.0.0",                // Terminal colors
  "ora": "^8.0.0",                  // Spinners
  "cli-table3": "^0.6.0",           // Table output
  "inquirer": "^9.0.0",             // Interactive prompts
  "keytar": "^7.0.0",               // Secure credential storage
  "chokidar": "^3.0.0",             // File watching
  "glob": "^10.0.0",                // File patterns
  "yaml": "^2.0.0"                  // Manifest parsing
}
```

### Distribution Strategy
1. **npm package** (primary)
   - `npm install -g @mixedbread/cli`
   - Requires Node.js installed

2. **Standalone binaries** (via pkg or similar)
   - No Node.js required
   - Larger file size (~50MB)
   - Platform-specific builds

3. **npx support** (no install needed)
   - `npx @mixedbread/cli vs list`

## Appendix: Future Enhancements

### Templates System
```bash
# Create vector store from template
mxbai vs create --template documentation

# Save current vector store as template
mxbai templates save <name> --from <vector-store>

# Community templates
mxbai templates install @company/template
```

### Export/Import Capabilities
```bash
# Export entire vector store with files
mxbai vs export <name> --include-files --output backup.tar.gz

# Import vector store from backup
mxbai vs import backup.tar.gz --name "Restored Store"

# Sync between environments
mxbai vs sync <source> <target> --strategy mirror
```

### Advanced Session Management
```bash
# Work with multiple profiles
mxbai profile create work --api-key $WORK_KEY
mxbai profile create personal --api-key $PERSONAL_KEY
mxbai profile use work

# Project-based configuration
mxbai init --project  # Creates .mxbai/config.json in current dir
```

### Plugin System
```javascript
// ~/.config/mixedbread/plugins/my-plugin.js
module.exports = {
  name: 'my-plugin',
  commands: [{
    name: 'custom-import',
    description: 'Import from custom source',
    action: async (vectorStore, options) => {
      // Custom logic
    }
  }]
}
```

### GUI/TUI Mode
```bash
# Launch interactive TUI
mxbai tui

# Features:
# - File browser for uploads
# - Real-time search preview
# - Visual progress tracking
# - Keyboard navigation
```

### Advanced Integrations
```bash
# GitHub Actions
- uses: mixedbread/cli-action@v1
  with:
    command: vs upload docs ./build/docs --manifest ci.yaml

# Pre-commit hooks
mxbai hooks install

# IDE extensions
# - VS Code: Browse vector stores in sidebar
# - IntelliJ: Search vector stores from IDE
```

### Smart Features
```bash
# Auto-detect file changes and suggest uploads
mxbai vs suggest <name> <directory>

# Duplicate detection
mxbai vs upload <name> ./files --skip-duplicates

# Content-based routing
mxbai vs upload <name> ./mixed-content --auto-categorize

# Advanced sync features
mxbai vs sync <name> ./docs \
  --strategy incremental \        # Only process chunks that changed
  --preserve-versions \           # Keep old versions for rollback
  --changelog ./CHANGELOG.md      # Generate changelog of updates

# Sync with multiple sources
mxbai vs sync <name> \
  --source ./docs \
  --source ./api-reference \
  --source ./tutorials \
  --merge-strategy replace        # or 'merge'

# Webhook notifications
mxbai vs sync <name> ./docs --ci \
  --webhook https://api.company.com/docs-updated \
  --webhook-secret $WEBHOOK_SECRET
```

## Next Steps

1. Set up TypeScript project with Commander.js
2. Implement core SDK wrapper with API key handling
3. Build MVP commands (vs create/list/upload, search)
4. Add progress tracking and error handling
5. Create test suite
6. Set up CI/CD pipeline
7. Documentation and examples