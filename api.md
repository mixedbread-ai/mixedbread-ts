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

# VectorStores

Types:

- <code><a href="./src/resources/vector-stores/vector-stores.ts">ExpiresAfter</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">FileCounts</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">ScoredVectorStoreChunk</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStore</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreChunkSearchOptions</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreFileSearchOptions</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreDeleteResponse</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreQuestionAnsweringResponse</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreSearchResponse</a></code>

Methods:

- <code title="post /v1/vector_stores">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">create</a>({ ...params }) -> VectorStore</code>
- <code title="get /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">retrieve</a>(vectorStoreId) -> VectorStore</code>
- <code title="put /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">update</a>(vectorStoreId, { ...params }) -> VectorStore</code>
- <code title="get /v1/vector_stores">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">list</a>({ ...params }) -> VectorStoresLimitOffset</code>
- <code title="delete /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">delete</a>(vectorStoreId) -> VectorStoreDeleteResponse</code>
- <code title="post /v1/vector_stores/question-answering">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">questionAnswering</a>({ ...params }) -> unknown</code>
- <code title="post /v1/vector_stores/search">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">search</a>({ ...params }) -> VectorStoreSearchResponse</code>

## Files

Types:

- <code><a href="./src/resources/vector-stores/files.ts">ScoredVectorStoreFile</a></code>
- <code><a href="./src/resources/vector-stores/files.ts">VectorStoreFile</a></code>
- <code><a href="./src/resources/vector-stores/files.ts">FileDeleteResponse</a></code>
- <code><a href="./src/resources/vector-stores/files.ts">FileSearchResponse</a></code>

Methods:

- <code title="post /v1/vector_stores/{vector_store_id}/files">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">create</a>(vectorStoreId, { ...params }) -> VectorStoreFile</code>
- <code title="get /v1/vector_stores/{vector_store_id}/files/{file_id}">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">retrieve</a>(vectorStoreId, fileId) -> VectorStoreFile</code>
- <code title="get /v1/vector_stores/{vector_store_id}/files">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">list</a>(vectorStoreId, { ...params }) -> VectorStoreFilesLimitOffset</code>
- <code title="delete /v1/vector_stores/{vector_store_id}/files/{file_id}">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">delete</a>(vectorStoreId, fileId) -> FileDeleteResponse</code>
- <code title="post /v1/vector_stores/files/search">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">search</a>({ ...params }) -> FileSearchResponse</code>

# Parsing

## Jobs

Types:

- <code><a href="./src/resources/parsing/jobs.ts">ParsingJob</a></code>
- <code><a href="./src/resources/parsing/jobs.ts">JobListResponse</a></code>
- <code><a href="./src/resources/parsing/jobs.ts">JobDeleteResponse</a></code>

Methods:

- <code title="post /v1/parsing/jobs">client.parsing.jobs.<a href="./src/resources/parsing/jobs.ts">create</a>({ ...params }) -> ParsingJob</code>
- <code title="get /v1/parsing/jobs/{job_id}">client.parsing.jobs.<a href="./src/resources/parsing/jobs.ts">retrieve</a>(jobId) -> ParsingJob</code>
- <code title="get /v1/parsing/jobs">client.parsing.jobs.<a href="./src/resources/parsing/jobs.ts">list</a>({ ...params }) -> JobListResponsesLimitOffset</code>
- <code title="delete /v1/parsing/jobs/{job_id}">client.parsing.jobs.<a href="./src/resources/parsing/jobs.ts">delete</a>(jobId) -> JobDeleteResponse</code>
- <code title="patch /v1/parsing/jobs/{job_id}">client.parsing.jobs.<a href="./src/resources/parsing/jobs.ts">cancel</a>(jobId) -> ParsingJob</code>

# Files

Types:

- <code><a href="./src/resources/files.ts">FileObject</a></code>
- <code><a href="./src/resources/files.ts">FileDeleteResponse</a></code>

Methods:

- <code title="post /v1/files">client.files.<a href="./src/resources/files.ts">create</a>({ ...params }) -> FileObject</code>
- <code title="get /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">retrieve</a>(fileId) -> FileObject</code>
- <code title="post /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">update</a>(fileId, { ...params }) -> FileObject</code>
- <code title="get /v1/files">client.files.<a href="./src/resources/files.ts">list</a>({ ...params }) -> FileObjectsLimitOffset</code>
- <code title="delete /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">delete</a>(fileId) -> FileDeleteResponse</code>
- <code title="get /v1/files/{file_id}/content">client.files.<a href="./src/resources/files.ts">content</a>(fileId) -> Response</code>

# Extractions

## Jobs

Types:

- <code><a href="./src/resources/extractions/jobs.ts">ExtractionJob</a></code>

Methods:

- <code title="post /v1/extractions/jobs">client.extractions.jobs.<a href="./src/resources/extractions/jobs.ts">create</a>({ ...params }) -> ExtractionJob</code>
- <code title="get /v1/extractions/jobs/{job_id}">client.extractions.jobs.<a href="./src/resources/extractions/jobs.ts">retrieve</a>(jobId) -> ExtractionJob</code>

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

Methods:

- <code title="post /v1/extractions/content">client.extractions.content.<a href="./src/resources/extractions/content.ts">create</a>({ ...params }) -> ExtractionResult</code>

# Embeddings

Methods:

- <code title="post /v1/embeddings">client.embeddings.<a href="./src/resources/embeddings.ts">create</a>({ ...params }) -> EmbeddingCreateResponse</code>
