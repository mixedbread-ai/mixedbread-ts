# Mixedbread

Types:

- <code><a href="./src/resources/top-level.ts">InfoResponse</a></code>

Methods:

- <code title="get /">client.<a href="./src/index.ts">info</a>() -> InfoResponse</code>

# DocumentAI

## Parse

### Jobs

Types:

- <code><a href="./src/resources/document-ai/parse/jobs.ts">ParsingJob</a></code>

Methods:

- <code title="post /v1/document-ai/parse">client.documentAI.parse.jobs.<a href="./src/resources/document-ai/parse/jobs.ts">create</a>({ ...params }) -> ParsingJob</code>
- <code title="get /v1/document-ai/parse/{job_id}">client.documentAI.parse.jobs.<a href="./src/resources/document-ai/parse/jobs.ts">retrieve</a>(jobId) -> ParsingJob</code>

# Embeddings

Types:

- <code><a href="./src/resources/embeddings.ts">EmbeddingCreateResponse</a></code>

Methods:

- <code title="post /v1/embeddings">client.embeddings.<a href="./src/resources/embeddings.ts">create</a>({ ...params }) -> EmbeddingCreateResponse</code>

# Reranking

Types:

- <code><a href="./src/resources/reranking.ts">RerankingCreateResponse</a></code>

Methods:

- <code title="post /v1/reranking">client.reranking.<a href="./src/resources/reranking.ts">create</a>({ ...params }) -> RerankingCreateResponse</code>

# Files

Types:

- <code><a href="./src/resources/files.ts">FileObject</a></code>
- <code><a href="./src/resources/files.ts">FileDeleteResponse</a></code>

Methods:

- <code title="post /v1/files">client.files.<a href="./src/resources/files.ts">create</a>({ ...params }) -> FileObject</code>
- <code title="get /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">retrieve</a>(fileId) -> FileObject</code>
- <code title="post /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">update</a>(fileId, { ...params }) -> FileObject</code>
- <code title="get /v1/files">client.files.<a href="./src/resources/files.ts">list</a>({ ...params }) -> FileObjectsPage</code>
- <code title="delete /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">delete</a>(fileId) -> FileDeleteResponse</code>
- <code title="get /v1/files/{file_id}/content">client.files.<a href="./src/resources/files.ts">content</a>(fileId) -> Response</code>

# VectorStores

Types:

- <code><a href="./src/resources/vector-stores/vector-stores.ts">ExpiresAfter</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">FileCounts</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">ScoredVectorStoreFile</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">SearchFilter</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">SearchFilterCondition</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStore</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreDeleteResponse</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreSearchResponse</a></code>

Methods:

- <code title="post /v1/vector_stores">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">create</a>({ ...params }) -> VectorStore</code>
- <code title="get /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">retrieve</a>(vectorStoreId) -> VectorStore</code>
- <code title="put /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">update</a>(vectorStoreId, { ...params }) -> VectorStore</code>
- <code title="get /v1/vector_stores">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">list</a>({ ...params }) -> VectorStoresPage</code>
- <code title="delete /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">delete</a>(vectorStoreId) -> VectorStoreDeleteResponse</code>
- <code title="post /v1/vector_stores/search">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">search</a>({ ...params }) -> VectorStoreSearchResponse</code>

## Files

Types:

- <code><a href="./src/resources/vector-stores/files.ts">VectorStoreFile</a></code>
- <code><a href="./src/resources/vector-stores/files.ts">FileDeleteResponse</a></code>

Methods:

- <code title="post /v1/vector_stores/{vector_store_id}/files">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">create</a>(vectorStoreId, { ...params }) -> VectorStoreFile</code>
- <code title="get /v1/vector_stores/{vector_store_id}/files/{file_id}">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">retrieve</a>(vectorStoreId, fileId) -> VectorStoreFile</code>
- <code title="get /v1/vector_stores/{vector_store_id}/files">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">list</a>(vectorStoreId, { ...params }) -> VectorStoreFilesPage</code>
- <code title="delete /v1/vector_stores/{vector_store_id}/files/{file_id}">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">delete</a>(vectorStoreId, fileId) -> FileDeleteResponse</code>
