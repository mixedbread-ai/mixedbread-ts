# Mixedbread API TypeScript SDK MCP Server

It is generated with [Stainless](https://www.stainless.com/).

## Installation

### Direct invocation

You can run the MCP Server directly via `npx`:

```sh
export MXBAI_API_KEY="My API Key"
npx -y @mixedbread/sdk-mcp
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
      "args": ["-y", "@mixedbread/sdk-mcp"],
      "env": {
        "MXBAI_API_KEY": "My API Key"
      }
    }
  }
}
```

## Filtering tools

You can run the package on the command line to discover and filter the set of tools that are exposed by the
MCP Server. This can be helpful for large APIs where including all endpoints at once is too much for your AI's
context window.

You can filter by multiple aspects:

- `--tool` includes a specific tool by name
- `--resource` includes all tools under a specific resource, and can have wildcards, e.g. `my.resource*`
- `--operation` includes just read (get/list) or just write operations

See more information with `--help`.

All of these command-line options can be repeated, combined together, and have corresponding exclusion versions (e.g. `--no-tool`).

Use `--list` to see the list of available tools, or see below.

## Importing the tools and server individually

```js
// Import the server, generated endpoints, or the init function
import { server, endpoints, init } from "@mixedbread/sdk-mcp/server";

// import a specific tool
import embedClient from "@mixedbread/sdk-mcp/tools/top-level/embed-client";

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
init({ server: myServer, endpoints: [embedClient, myCustomEndpoint] });
```

## Available Tools

The following tools are available in this MCP server.

### Resource `$client`:

- `embed_client` (`write`): Create embeddings for text or images using the specified model, encoding format, and normalization.

Args:
params: The parameters for creating embeddings.

Returns:
EmbeddingCreateResponse: The response containing the embeddings.

- `info_client` (`read`): Returns service information, including name and version.

Returns:
InfoResponse: A response containing the service name and version.

- `rerank_client` (`write`): Rerank different kind of documents for a given query.

Args:
params: RerankParams: The parameters for reranking.

Returns:
RerankResponse: The reranked documents for the input query.

### Resource `vector_stores`:

- `create_vector_stores` (`write`): Create a new vector store.

Args:
vector_store_create: VectorStoreCreate object containing the name, description, and metadata.

Returns:
VectorStore: The response containing the created vector store details.

- `retrieve_vector_stores` (`read`): Get a vector store by ID.

Args:
vector_store_id: The ID of the vector store to retrieve.

Returns:
VectorStore: The response containing the vector store details.

- `update_vector_stores` (`write`): Update a vector store by ID.

Args:
vector_store_id: The ID of the vector store to update.
vector_store_update: VectorStoreCreate object containing the name, description, and metadata.

Returns:
VectorStore: The response containing the updated vector store details.

- `list_vector_stores` (`read`): List all vector stores.

Args:
pagination: The pagination options.

Returns:
VectorStoreListResponse: The list of vector stores.

- `delete_vector_stores` (`write`): Delete a vector store by ID.

Args:
vector_store_id: The ID of the vector store to delete.

Returns:
VectorStore: The response containing the deleted vector store details.

- `question_answering_vector_stores` (`write`): Question answering
- `search_vector_stores` (`write`): Perform semantic search across vector store chunks.

This endpoint searches through vector store chunks using semantic similarity matching.
It supports complex search queries with filters and returns relevance-scored results.

Args:
search_params: Search configuration including: - query text or embeddings - metadata filters - pagination parameters - sorting preferences
\_state: API state dependency
\_ctx: Service context dependency

Returns:
VectorStoreSearchChunkResponse containing: - List of matched chunks with relevance scores - Pagination details including total result count

Raises:
HTTPException (400): If search parameters are invalid
HTTPException (404): If no vector stores are found to search

### Resource `vector_stores.files`:

- `create_vector_stores_files` (`write`): Upload a new file to a vector store for indexing.

Args:
vector_store_id: The ID of the vector store to upload to
file: The file to upload and index

Returns:
VectorStoreFile: Details of the uploaded and indexed file

- `retrieve_vector_stores_files` (`read`): Get details of a specific file in a vector store.

Args:
vector_store_id: The ID of the vector store
file_id: The ID of the file

Returns:
VectorStoreFile: Details of the vector store file

- `list_vector_stores_files` (`read`): List files indexed in a vector store with pagination.

Args:
vector_store_id: The ID of the vector store
pagination: Pagination parameters

Returns:
VectorStoreFileListResponse: Paginated list of vector store files

- `delete_vector_stores_files` (`write`): Delete a file from a vector store.

Args:
vector_store_id: The ID of the vector store
file_id: The ID of the file to delete

Returns:
VectorStoreFileDeleted: The deleted file

- `search_vector_stores_files` (`write`): Perform semantic search across complete vector store files.

This endpoint searches through vector store files using semantic similarity matching.
Unlike chunk search, it returns complete matching files rather than individual chunks.
Supports complex search queries with filters and returns relevance-scored results.

Args:
search_params: Search configuration including: - query text or embeddings - metadata filters - pagination parameters - sorting preferences
\_state: API state dependency
\_ctx: Service context dependency

Returns:
VectorStoreSearchFileResponse containing: - List of matched files with relevance scores - Pagination details including total result count

Raises:
HTTPException (400): If search parameters are invalid
HTTPException (404): If no vector stores are found to search

### Resource `parsing.jobs`:

- `create_parsing_jobs` (`write`): Start a parse job for the provided file.

Args:
params: The parameters for creating a parse job.

Returns:
The created parsing job.

- `retrieve_parsing_jobs` (`read`): Get detailed information about a specific parse job.

Args:
job_id: The ID of the parse job.

Returns:
Detailed information about the parse job.

- `list_parsing_jobs` (`read`): List parsing jobs with pagination.

Args:
limit: The number of items to return.
offset: The number of items to skip.

Returns:
List of parsing jobs with pagination.

- `delete_parsing_jobs` (`write`): Delete a specific parse job.

Args:
job_id: The ID of the parse job to delete.

Returns:
The deleted parsing job.

- `cancel_parsing_jobs` (`write`): Cancel a specific parse job.

Args:
job_id: The ID of the parse job to cancel.

Returns:
The cancelled parsing job.

### Resource `files`:

- `create_files` (`write`): Upload a new file.

Args:
file: The file to upload.

Returns:
FileResponse: The response containing the details of the uploaded file.

- `retrieve_files` (`read`): Retrieve details of a specific file by its ID.

Args:
file_id: The ID of the file to retrieve.

Returns:
FileResponse: The response containing the file details.

- `update_files` (`write`): Update the details of a specific file.

Args:
file_id: The ID of the file to update.
file: The new details for the file.

Returns:
FileObject: The updated file details.

- `list_files` (`read`): List all files for the authenticated user.

Args:
pagination: The pagination options

Returns:
A list of files belonging to the user.

- `delete_files` (`write`): Delete a specific file by its ID.

Args:
file_id: The ID of the file to delete.

Returns:
FileDeleted: The response containing the details of the deleted file.

- `content_files` (`read`): Download a specific file by its ID.

Args:
file_id: The ID of the file to download.

Returns:
FileStreamResponse: The response containing the file to be downloaded.

### Resource `extractions.jobs`:

- `create_extractions_jobs` (`write`): Start an extraction job for the provided file and schema.

Args:
params: The parameters for creating an extraction job.

Returns:
The created extraction job.

- `retrieve_extractions_jobs` (`read`): Get detailed information about a specific extraction job.

Args:
job_id: The ID of the extraction job.

Returns:
Detailed information about the extraction job.

### Resource `extractions.schema`:

- `create_extractions_schema` (`write`): Create a schema with the provided parameters.

Args:
params: The parameters for creating a schema.

Returns:
The created schema.

- `enhance_extractions_schema` (`write`): Enhance a schema by enriching the descriptions to aid extraction.

Args:
params: The parameters for enhancing a schema.

Returns:
The enhanced schema.

- `validate_extractions_schema` (`write`): Validate a schema.

Args:
params: The parameters for validating a schema.

Returns:
The validation result.

### Resource `extractions.content`:

- `create_extractions_content` (`write`): Extract content from a string using the provided schema.

Args:
params: The parameters for extracting content from a string.

Returns:
The extracted content.

### Resource `embeddings`:

- `create_embeddings` (`write`): Create embeddings for text or images using the specified model, encoding format, and normalization.

Args:
params: The parameters for creating embeddings.

Returns:
EmbeddingCreateResponse: The response containing the embeddings.
