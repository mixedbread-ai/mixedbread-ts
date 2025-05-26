# Mixedbread

Types:

- <code><a href="./src/resources/top-level.ts">Embedding</a></code>
- <code><a href="./src/resources/top-level.ts">EmbeddingCreateResponse</a></code>
- <code><a href="./src/resources/top-level.ts">MultiEncodingEmbedding</a></code>
- <code><a href="./src/resources/top-level.ts">InfoResponse</a></code>
- <code><a href="./src/resources/top-level.ts">RerankResponse</a></code>

Methods:

- <code title="post /v1/embeddings">client.<a href="./src/index.ts">embed</a>({ ...params }) -> EmbeddingCreateResponse</code>
- <code title="get /">client.<a href="./src/index.ts">info</a>() -> InfoResponse</code>
- <code title="post /v1/reranking">client.<a href="./src/index.ts">rerank</a>({ ...params }) -> RerankResponse</code>

# Shared

Types:

- <code><a href="./src/resources/shared.ts">SearchFilter</a></code>
- <code><a href="./src/resources/shared.ts">SearchFilterCondition</a></code>
- <code><a href="./src/resources/shared.ts">Usage</a></code>

# VectorStores

Types:

- <code><a href="./src/resources/vector-stores/vector-stores.ts">ExpiresAfter</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">FileCounts</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStore</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreChunkSearchOptions</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreFileSearchOptions</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreDeleteResponse</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreQuestionAnsweringResponse</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreSearchResponse</a></code>

Methods:

- <code title="post /v1/vector_stores">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">create</a>({ ...params }) -> VectorStore</code>
- <code title="get /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">retrieve</a>(vectorStoreID) -> VectorStore</code>
- <code title="put /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">update</a>(vectorStoreID, { ...params }) -> VectorStore</code>
- <code title="get /v1/vector_stores">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">list</a>({ ...params }) -> VectorStoresLimitOffset</code>
- <code title="delete /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">delete</a>(vectorStoreID) -> VectorStoreDeleteResponse</code>
- <code title="post /v1/vector_stores/question-answering">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">questionAnswering</a>({ ...params }) -> VectorStoreQuestionAnsweringResponse</code>
- <code title="post /v1/vector_stores/search">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">search</a>({ ...params }) -> VectorStoreSearchResponse</code>

## Files

Types:

- <code><a href="./src/resources/vector-stores/files.ts">ScoredVectorStoreFile</a></code>
- <code><a href="./src/resources/vector-stores/files.ts">VectorStoreFile</a></code>
- <code><a href="./src/resources/vector-stores/files.ts">FileDeleteResponse</a></code>
- <code><a href="./src/resources/vector-stores/files.ts">FileSearchResponse</a></code>

Methods:

- <code title="post /v1/vector_stores/{vector_store_id}/files">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">create</a>(vectorStoreID, { ...params }) -> VectorStoreFile</code>
- <code title="get /v1/vector_stores/{vector_store_id}/files/{file_id}">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">retrieve</a>(fileID, { ...params }) -> VectorStoreFile</code>
- <code title="get /v1/vector_stores/{vector_store_id}/files">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">list</a>(vectorStoreID, { ...params }) -> VectorStoreFilesLimitOffset</code>
- <code title="delete /v1/vector_stores/{vector_store_id}/files/{file_id}">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">delete</a>(fileID, { ...params }) -> FileDeleteResponse</code>
- <code title="post /v1/vector_stores/files/search">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">search</a>({ ...params }) -> FileSearchResponse</code>

# Parsing

## Jobs

Types:

- <code><a href="./src/resources/parsing/jobs.ts">ChunkingStrategy</a></code>
- <code><a href="./src/resources/parsing/jobs.ts">ElementType</a></code>
- <code><a href="./src/resources/parsing/jobs.ts">ParsingJobStatus</a></code>
- <code><a href="./src/resources/parsing/jobs.ts">ParsingJob</a></code>
- <code><a href="./src/resources/parsing/jobs.ts">ReturnFormat</a></code>
- <code><a href="./src/resources/parsing/jobs.ts">JobListResponse</a></code>
- <code><a href="./src/resources/parsing/jobs.ts">JobDeleteResponse</a></code>

Methods:

- <code title="post /v1/parsing/jobs">client.parsing.jobs.<a href="./src/resources/parsing/jobs.ts">create</a>({ ...params }) -> ParsingJob</code>
- <code title="get /v1/parsing/jobs/{job_id}">client.parsing.jobs.<a href="./src/resources/parsing/jobs.ts">retrieve</a>(jobID) -> ParsingJob</code>
- <code title="get /v1/parsing/jobs">client.parsing.jobs.<a href="./src/resources/parsing/jobs.ts">list</a>({ ...params }) -> JobListResponsesLimitOffset</code>
- <code title="delete /v1/parsing/jobs/{job_id}">client.parsing.jobs.<a href="./src/resources/parsing/jobs.ts">delete</a>(jobID) -> JobDeleteResponse</code>
- <code title="patch /v1/parsing/jobs/{job_id}">client.parsing.jobs.<a href="./src/resources/parsing/jobs.ts">cancel</a>(jobID) -> ParsingJob</code>

# Files

Types:

- <code><a href="./src/resources/files.ts">FileObject</a></code>
- <code><a href="./src/resources/files.ts">PaginationWithTotal</a></code>
- <code><a href="./src/resources/files.ts">FileDeleteResponse</a></code>

Methods:

- <code title="post /v1/files">client.files.<a href="./src/resources/files.ts">create</a>({ ...params }) -> FileObject</code>
- <code title="get /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">retrieve</a>(fileID) -> FileObject</code>
- <code title="post /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">update</a>(fileID, { ...params }) -> FileObject</code>
- <code title="get /v1/files">client.files.<a href="./src/resources/files.ts">list</a>({ ...params }) -> FileObjectsLimitOffset</code>
- <code title="delete /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">delete</a>(fileID) -> FileDeleteResponse</code>
- <code title="get /v1/files/{file_id}/content">client.files.<a href="./src/resources/files.ts">content</a>(fileID) -> Response</code>

# Extractions

## Jobs

Types:

- <code><a href="./src/resources/extractions/jobs.ts">ExtractionJob</a></code>

Methods:

- <code title="post /v1/extractions/jobs">client.extractions.jobs.<a href="./src/resources/extractions/jobs.ts">create</a>({ ...params }) -> ExtractionJob</code>
- <code title="get /v1/extractions/jobs/{job_id}">client.extractions.jobs.<a href="./src/resources/extractions/jobs.ts">retrieve</a>(jobID) -> ExtractionJob</code>

## Schema

Types:

- <code><a href="./src/resources/extractions/schema.ts">CreatedJsonSchema</a></code>
- <code><a href="./src/resources/extractions/schema.ts">EnhancedJsonSchema</a></code>
- <code><a href="./src/resources/extractions/schema.ts">ValidatedJsonSchema</a></code>

Methods:

- <code title="post /v1/extractions/schema">client.extractions.schema.<a href="./src/resources/extractions/schema.ts">create</a>({ ...params }) -> CreatedJsonSchema</code>
- <code title="post /v1/extractions/schema/enhance">client.extractions.schema.<a href="./src/resources/extractions/schema.ts">enhance</a>({ ...params }) -> EnhancedJsonSchema</code>
- <code title="post /v1/extractions/schema/validate">client.extractions.schema.<a href="./src/resources/extractions/schema.ts">validate</a>({ ...params }) -> ValidatedJsonSchema</code>

## Content

Types:

- <code><a href="./src/resources/extractions/content.ts">ExtractionResult</a></code>
- <code><a href="./src/resources/extractions/content.ts">ImageURLInput</a></code>
- <code><a href="./src/resources/extractions/content.ts">TextInput</a></code>

Methods:

- <code title="post /v1/extractions/content">client.extractions.content.<a href="./src/resources/extractions/content.ts">create</a>({ ...params }) -> ExtractionResult</code>

# Embeddings

Types:

- <code><a href="./src/resources/embeddings.ts">EncodingFormat</a></code>
- <code><a href="./src/resources/embeddings.ts">ObjectType</a></code>

Methods:

- <code title="post /v1/embeddings">client.embeddings.<a href="./src/resources/embeddings.ts">create</a>({ ...params }) -> EmbeddingCreateResponse</code>

# Chat

Types:

- <code><a href="./src/resources/chat.ts">ChatCreateCompletionResponse</a></code>

Methods:

- <code title="post /v1/chat/completions">client.chat.<a href="./src/resources/chat.ts">createCompletion</a>() -> unknown</code>

# DataSources

Types:

- <code><a href="./src/resources/data-sources/data-sources.ts">DataSource</a></code>
- <code><a href="./src/resources/data-sources/data-sources.ts">DataSourceOauth2Params</a></code>
- <code><a href="./src/resources/data-sources/data-sources.ts">DataSourceType</a></code>
- <code><a href="./src/resources/data-sources/data-sources.ts">DataSourceDeleteResponse</a></code>

Methods:

- <code title="post /v1/data_sources/">client.dataSources.<a href="./src/resources/data-sources/data-sources.ts">create</a>({ ...params }) -> DataSource</code>
- <code title="get /v1/data_sources/{data_source_id}">client.dataSources.<a href="./src/resources/data-sources/data-sources.ts">retrieve</a>(dataSourceID) -> DataSource</code>
- <code title="put /v1/data_sources/{data_source_id}">client.dataSources.<a href="./src/resources/data-sources/data-sources.ts">update</a>(dataSourceID, { ...params }) -> DataSource</code>
- <code title="get /v1/data_sources/">client.dataSources.<a href="./src/resources/data-sources/data-sources.ts">list</a>({ ...params }) -> DataSourcesLimitOffset</code>
- <code title="delete /v1/data_sources/{data_source_id}">client.dataSources.<a href="./src/resources/data-sources/data-sources.ts">delete</a>(dataSourceID) -> DataSourceDeleteResponse</code>

## Connectors

Types:

- <code><a href="./src/resources/data-sources/connectors.ts">DataSourceConnector</a></code>
- <code><a href="./src/resources/data-sources/connectors.ts">ConnectorDeleteResponse</a></code>

Methods:

- <code title="post /v1/data_sources/{data_source_id}/connectors">client.dataSources.connectors.<a href="./src/resources/data-sources/connectors.ts">create</a>(dataSourceID, { ...params }) -> DataSourceConnector</code>
- <code title="get /v1/data_sources/{data_source_id}/connectors/{connector_id}">client.dataSources.connectors.<a href="./src/resources/data-sources/connectors.ts">retrieve</a>(connectorID, { ...params }) -> DataSourceConnector</code>
- <code title="put /v1/data_sources/{data_source_id}/connectors/{connector_id}">client.dataSources.connectors.<a href="./src/resources/data-sources/connectors.ts">update</a>(connectorID, { ...params }) -> DataSourceConnector</code>
- <code title="get /v1/data_sources/{data_source_id}/connectors">client.dataSources.connectors.<a href="./src/resources/data-sources/connectors.ts">list</a>(dataSourceID, { ...params }) -> DataSourceConnectorsLimitOffset</code>
- <code title="delete /v1/data_sources/{data_source_id}/connectors/{connector_id}">client.dataSources.connectors.<a href="./src/resources/data-sources/connectors.ts">delete</a>(connectorID, { ...params }) -> ConnectorDeleteResponse</code>

# APIKeys

Types:

- <code><a href="./src/resources/api-keys.ts">APIKey</a></code>
- <code><a href="./src/resources/api-keys.ts">APIKeyCreated</a></code>
- <code><a href="./src/resources/api-keys.ts">APIKeyDeleteResponse</a></code>

Methods:

- <code title="post /v1/api-keys">client.apiKeys.<a href="./src/resources/api-keys.ts">create</a>({ ...params }) -> APIKeyCreated</code>
- <code title="get /v1/api-keys/{api_key_id}">client.apiKeys.<a href="./src/resources/api-keys.ts">retrieve</a>(apiKeyID) -> APIKey</code>
- <code title="get /v1/api-keys">client.apiKeys.<a href="./src/resources/api-keys.ts">list</a>({ ...params }) -> APIKeysLimitOffset</code>
- <code title="delete /v1/api-keys/{api_key_id}">client.apiKeys.<a href="./src/resources/api-keys.ts">delete</a>(apiKeyID) -> APIKeyDeleteResponse</code>
- <code title="post /v1/api-keys/{api_key_id}/reroll">client.apiKeys.<a href="./src/resources/api-keys.ts">reroll</a>(apiKeyID) -> APIKeyCreated</code>
- <code title="post /v1/api-keys/{api_key_id}/revoke">client.apiKeys.<a href="./src/resources/api-keys.ts">revoke</a>(apiKeyID) -> APIKey</code>
