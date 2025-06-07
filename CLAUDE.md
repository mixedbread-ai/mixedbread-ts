# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official Mixedbread API TypeScript SDK - a generated client library that provides convenient access to the Mixedbread REST API. The SDK is generated using Stainless and supports multiple JavaScript runtimes including Node.js, Deno, Bun, browsers, and edge runtimes.

## Common Development Commands

### Build and Development
```bash
# Install dependencies (use yarn, not npm)
yarn install

# Build the SDK
yarn build

# Run tests
yarn test

# Run specific test file
yarn test path/to/test.test.ts

# Lint and type check
yarn lint

# Format code
yarn format
```

### Testing with Mock Server
```bash
# Start mock API server in background
./scripts/mock --daemon

# Run tests with custom API endpoint
TEST_API_BASE_URL=http://localhost:3000 yarn test

# Run tests matching pattern
yarn test --testNamePattern="embeddings"
```

## High-Level Architecture

### Core SDK Structure
The SDK follows a resource-based architecture where each API feature is implemented as a resource class:

1. **Client Entry Point** (`src/client.ts`): 
   - Main `MixedbreadClient` class that initializes all resources
   - Handles authentication, retries, request building, and error handling
   - Configures HTTP client with proper headers and timeout settings

2. **Resource Classes** (`src/resources/`):
   - Each API feature (embeddings, vector stores, chat, etc.) is a separate resource
   - Resources inherit from `APIResource` base class
   - Nested resources (e.g., `vector-stores/files.ts`) follow the API structure

3. **Core Infrastructure** (`src/core/`):
   - `APIPromise`: Enhanced promises that support streaming and raw responses
   - `Page`: Auto-pagination support for list endpoints
   - `MixedbreadError`: Typed error hierarchy for different HTTP status codes

4. **Internal Utilities** (`src/internal/`):
   - Platform detection and compatibility shims for multi-runtime support
   - Request/response parsing and transformation
   - File upload handling with support for various input types

### Key Architectural Patterns

1. **Request Flow**:
   ```
   Client Method → Resource Method → buildRequest → fetch → parseResponse → APIPromise
   ```

2. **Error Handling**:
   - All API errors extend `MixedbreadError` with specific types for each status code
   - Automatic retry logic with exponential backoff (2 retries by default)
   - Detailed error messages include request ID and status information

3. **Type Safety**:
   - All request parameters and responses have TypeScript interfaces
   - Strict null checks and type validation throughout
   - Generated types ensure API compatibility

4. **Multi-Runtime Support**:
   - Shims system (`src/internal/shims.ts`) provides runtime-specific implementations
   - Automatic detection of Node.js, Deno, Bun, or browser environments
   - Consistent API across all supported platforms

### Important Implementation Notes

1. **Generated Code**: Most files are auto-generated. Manual edits to generated files will be lost. Safe directories for custom code:
   - `src/lib/` - Custom utilities and helpers
   - `examples/` - Usage examples

2. **Testing Strategy**:
   - Tests use a Prism mock server that validates against OpenAPI spec
   - Each resource has comprehensive test coverage
   - Tests verify both success and error scenarios

3. **Build Process**:
   - TypeScript compilation targets both CommonJS and ESM
   - Multiple TypeScript configs for different build targets
   - Custom post-processing fixes module exports

4. **API Authentication**:
   - Requires `MXBAI_API_KEY` environment variable or explicit apiKey parameter
   - Supports custom environments ('production' or 'local')

### Development Workflow

When adding new features or fixing bugs:

1. Identify if working with generated or custom code
2. For API changes, update the OpenAPI spec and regenerate
3. For custom logic, add to `src/lib/` directory
4. Write tests following existing patterns in `tests/`
5. Ensure all commands pass: `yarn lint && yarn test`

### Key Files to Understand

- `src/index.ts` - Public API exports
- `src/client.ts` - Core client implementation
- `src/core/resource.ts` - Base class for all resources
- `src/internal/shims.ts` - Runtime compatibility layer
- `api.md` - Complete API documentation