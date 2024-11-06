# Mixedbread

Types:

- <code><a href="./src/resources/top-level.ts">EmbedResponse</a></code>
- <code><a href="./src/resources/top-level.ts">InfoResponse</a></code>
- <code><a href="./src/resources/top-level.ts">RerankResponse</a></code>

Methods:

- <code title="post /v1/embeddings">client.<a href="./src/index.ts">embed</a>({ ...params }) -> EmbedResponse</code>
- <code title="get /">client.<a href="./src/index.ts">info</a>() -> InfoResponse</code>
- <code title="post /v1/reranking">client.<a href="./src/index.ts">rerank</a>({ ...params }) -> RerankResponse</code>

# DocumentAI

## Parse

Types:

- <code><a href="./src/resources/document-ai/parse.ts">ParseCreateJobResponse</a></code>
- <code><a href="./src/resources/document-ai/parse.ts">ParseRetrieveJobResponse</a></code>

Methods:

- <code title="post /v1/document-ai/parse">client.documentAI.parse.<a href="./src/resources/document-ai/parse.ts">createJob</a>({ ...params }) -> ParseCreateJobResponse</code>
- <code title="get /v1/document-ai/parse/{job_id}">client.documentAI.parse.<a href="./src/resources/document-ai/parse.ts">retrieveJob</a>(jobId) -> ParseRetrieveJobResponse</code>

# Embeddings

Types:

- <code><a href="./src/resources/embeddings.ts">EmbeddingCreateResponse</a></code>

Methods:

- <code title="post /v1/embeddings">client.embeddings.<a href="./src/resources/embeddings.ts">create</a>({ ...params }) -> EmbeddingCreateResponse</code>

# Rerankings

Types:

- <code><a href="./src/resources/rerankings.ts">RerankingCreateResponse</a></code>

Methods:

- <code title="post /v1/reranking">client.rerankings.<a href="./src/resources/rerankings.ts">create</a>({ ...params }) -> RerankingCreateResponse</code>

# Files

Types:

- <code><a href="./src/resources/files.ts">FileDeleted</a></code>
- <code><a href="./src/resources/files.ts">FileObject</a></code>
- <code><a href="./src/resources/files.ts">FileListResponse</a></code>

Methods:

- <code title="post /v1/files">client.files.<a href="./src/resources/files.ts">create</a>({ ...params }) -> FileObject</code>
- <code title="get /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">retrieve</a>(fileId) -> FileObject</code>
- <code title="post /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">update</a>(fileId, { ...params }) -> FileObject</code>
- <code title="get /v1/files">client.files.<a href="./src/resources/files.ts">list</a>({ ...params }) -> FileListResponse</code>
- <code title="delete /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">delete</a>(fileId) -> FileDeleted</code>
- <code title="get /v1/files/{file_id}/content">client.files.<a href="./src/resources/files.ts">content</a>(fileId) -> Response</code>

# Jobs

Types:

- <code><a href="./src/resources/jobs.ts">JobStatus</a></code>
- <code><a href="./src/resources/jobs.ts">JobDeleteResponse</a></code>

Methods:

- <code title="get /v1/jobs/{job_id}">client.jobs.<a href="./src/resources/jobs.ts">retrieve</a>(jobId) -> JobStatus</code>
- <code title="delete /v1/jobs/{job_id}">client.jobs.<a href="./src/resources/jobs.ts">delete</a>(jobId) -> JobDeleteResponse</code>

# VectorStores

Types:

- <code><a href="./src/resources/vector-stores/vector-stores.ts">SearchResponse</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStore</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreListResponse</a></code>
- <code><a href="./src/resources/vector-stores/vector-stores.ts">VectorStoreDeleteResponse</a></code>

Methods:

- <code title="post /v1/vector_stores">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">create</a>({ ...params }) -> VectorStore</code>
- <code title="get /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">retrieve</a>(vectorStoreId) -> VectorStore</code>
- <code title="put /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">update</a>(vectorStoreId, { ...params }) -> VectorStore</code>
- <code title="get /v1/vector_stores">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">list</a>({ ...params }) -> VectorStoreListResponse</code>
- <code title="delete /v1/vector_stores/{vector_store_id}">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">delete</a>(vectorStoreId) -> VectorStoreDeleteResponse</code>
- <code title="post /v1/vector_stores/search">client.vectorStores.<a href="./src/resources/vector-stores/vector-stores.ts">search</a>({ ...params }) -> SearchResponse</code>

## Files

Types:

- <code><a href="./src/resources/vector-stores/files.ts">VectorStoreFile</a></code>
- <code><a href="./src/resources/vector-stores/files.ts">FileListResponse</a></code>
- <code><a href="./src/resources/vector-stores/files.ts">FileDeleteResponse</a></code>

Methods:

- <code title="post /v1/vector_stores/{vector_store_id}/files">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">create</a>(vectorStoreId, { ...params }) -> VectorStoreFile</code>
- <code title="get /v1/vector_stores/{vector_store_id}/files/{file_id}">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">retrieve</a>(vectorStoreId, fileId) -> VectorStoreFile</code>
- <code title="get /v1/vector_stores/{vector_store_id}/files">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">list</a>(vectorStoreId, { ...params }) -> FileListResponse</code>
- <code title="delete /v1/vector_stores/{vector_store_id}/files/{file_id}">client.vectorStores.files.<a href="./src/resources/vector-stores/files.ts">delete</a>(vectorStoreId, fileId) -> FileDeleteResponse</code>
