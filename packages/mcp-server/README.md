# Mixedbread API TypeScript SDK MCP Server

It is generated with [Stainless](https://www.stainless.com/).

## Installation

### Direct invocation

You can run the MCP Server directly via `npx`:

```sh
export MXBAI_API_KEY="My API Key"
export MIXEDBREAD_ENVIRONMENT="production"
npx -y @mixedbread/mcp@latest
```

### Via MCP Client

There is a partial list of existing clients at [modelcontextprotocol.io](https://modelcontextprotocol.io/clients). If you already
have a client, consult their documentation to install the MCP server.

For clients with a configuration JSON, it might look something like this:

```json
{
  "mcpServers": {
    "mixedbread_sdk_api": {
      "command": "npx",
      "args": ["-y", "@mixedbread/mcp", "--client=claude", "--tools=all"],
      "env": {
        "MXBAI_API_KEY": "My API Key",
        "MIXEDBREAD_ENVIRONMENT": "production"
      }
    }
  }
}
```

## Exposing endpoints to your MCP Client

There are two ways to expose endpoints as tools in the MCP server:

1. Exposing one tool per endpoint, and filtering as necessary
2. Exposing a set of tools to dynamically discover and invoke endpoints from the API

### Filtering endpoints and tools

You can run the package on the command line to discover and filter the set of tools that are exposed by the
MCP Server. This can be helpful for large APIs where including all endpoints at once is too much for your AI's
context window.

You can filter by multiple aspects:

- `--tool` includes a specific tool by name
- `--resource` includes all tools under a specific resource, and can have wildcards, e.g. `my.resource*`
- `--operation` includes just read (get/list) or just write operations

### Dynamic tools

If you specify `--tools=dynamic` to the MCP server, instead of exposing one tool per endpoint in the API, it will
expose the following tools:

1. `list_api_endpoints` - Discovers available endpoints, with optional filtering by search query
2. `get_api_endpoint_schema` - Gets detailed schema information for a specific endpoint
3. `invoke_api_endpoint` - Executes any endpoint with the appropriate parameters

This allows you to have the full set of API endpoints available to your MCP Client, while not requiring that all
of their schemas be loaded into context at once. Instead, the LLM will automatically use these tools together to
search for, look up, and invoke endpoints dynamically. However, due to the indirect nature of the schemas, it
can struggle to provide the correct properties a bit more than when tools are imported explicitly. Therefore,
you can opt-in to explicit tools, the dynamic tools, or both.

See more information with `--help`.

All of these command-line options can be repeated, combined together, and have corresponding exclusion versions (e.g. `--no-tool`).

Use `--list` to see the list of available tools, or see below.

### Specifying the MCP Client

Different clients have varying abilities to handle arbitrary tools and schemas.

You can specify the client you are using with the `--client` argument, and the MCP server will automatically
serve tools and schemas that are more compatible with that client.

- `--client=<type>`: Set all capabilities based on a known MCP client

  - Valid values: `openai-agents`, `claude`, `claude-code`, `cursor`
  - Example: `--client=cursor`

Additionally, if you have a client not on the above list, or the client has gotten better
over time, you can manually enable or disable certain capabilities:

- `--capability=<name>`: Specify individual client capabilities
  - Available capabilities:
    - `top-level-unions`: Enable support for top-level unions in tool schemas
    - `valid-json`: Enable JSON string parsing for arguments
    - `refs`: Enable support for $ref pointers in schemas
    - `unions`: Enable support for union types (anyOf) in schemas
    - `formats`: Enable support for format validations in schemas (e.g. date-time, email)
    - `tool-name-length=N`: Set maximum tool name length to N characters
  - Example: `--capability=top-level-unions --capability=tool-name-length=40`
  - Example: `--capability=top-level-unions,tool-name-length=40`

### Examples

1. Filter for read operations on cards:

```bash
--resource=cards --operation=read
```

2. Exclude specific tools while including others:

```bash
--resource=cards --no-tool=create_cards
```

3. Configure for Cursor client with custom max tool name length:

```bash
--client=cursor --capability=tool-name-length=40
```

4. Complex filtering with multiple criteria:

```bash
--resource=cards,accounts --operation=read --tag=kyc --no-tool=create_cards
```

## Importing the tools and server individually

```js
// Import the server, generated endpoints, or the init function
import { server, endpoints, init } from "@mixedbread/mcp/server";

// import a specific tool
import retrieveVectorStores from "@mixedbread/mcp/tools/vector-stores/retrieve-vector-stores";

// initialize the server and all endpoints
init({ server, endpoints });

// manually start server
const transport = new StdioServerTransport();
await server.connect(transport);

// or initialize your own server with specific tools
const myServer = new McpServer(...);

// define your own endpoint
const myCustomEndpoint = {
  tool: {
    name: 'my_custom_tool',
    description: 'My custom tool',
    inputSchema: zodToJsonSchema(z.object({ a_property: z.string() })),
  },
  handler: async (client: client, args: any) => {
    return { myResponse: 'Hello world!' };
  })
};

// initialize the server with your custom endpoints
init({ server: myServer, endpoints: [retrieveVectorStores, myCustomEndpoint] });
```

## Available Tools

The following tools are available in this MCP server.

### Resource `vector_stores`:

- `retrieve_vector_stores` (`read`): Get a vector store by ID or name.

  Args:
  vector_store_identifier: The ID or name of the vector store to retrieve.

  Returns:
  VectorStore: The response containing the vector store details.

- `list_vector_stores` (`read`): List all vector stores with optional search.

  Args:
  pagination: The pagination options.
  q: Optional search query to filter vector stores.

  Returns:
  VectorStoreListResponse: The list of vector stores.

- `question_answering_vector_stores` (`write`): Question answering
- `search_vector_stores` (`write`): Perform semantic search across vector store chunks.

  This endpoint searches through vector store chunks using semantic similarity matching.
  It supports complex search queries with filters and returns relevance-scored results.

  Args:
  search_params: Search configuration including: - query text or embeddings - vector_store_ids: List of vector stores to search - file_ids: Optional list of file IDs to filter chunks by (or tuple of list and condition operator) - metadata filters - pagination parameters - sorting preferences
  \_state: API state dependency
  \_ctx: Service context dependency

  Returns:
  VectorStoreSearchChunkResponse containing: - List of matched chunks with relevance scores - Pagination details including total result count

  Raises:
  HTTPException (400): If search parameters are invalid
  HTTPException (404): If no vector stores are found to search

### Resource `vector_stores.files`:

- `retrieve_vector_stores_files` (`read`): Get details of a specific file in a vector store.

  Args:
  vector_store_identifier: The ID or name of the vector store
  file_id: The ID of the file

  Returns:
  VectorStoreFile: Details of the vector store file

- `list_vector_stores_files` (`read`): List files indexed in a vector store with pagination.

  Args:
  vector_store_identifier: The ID or name of the vector store
  pagination: Pagination parameters

  Returns:
  VectorStoreFileListResponse: Paginated list of vector store files
