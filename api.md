# ServiceStatus

Types:

- <code><a href="./src/resources/service-status.ts">InfoResponse</a></code>

Methods:

- <code title="get /">client.serviceStatus.<a href="./src/resources/service-status.ts">retrieve</a>() -> InfoResponse</code>

# Di

## Parse

Types:

- <code><a href="./src/resources/di/parse.ts">ParseResponse</a></code>

Methods:

- <code title="post /v1/document-intelligence/parse">client.di.parse.<a href="./src/resources/di/parse.ts">create</a>({ ...params }) -> ParseResponse</code>
- <code title="get /v1/document-intelligence/parse/{job_id}">client.di.parse.<a href="./src/resources/di/parse.ts">retrieve</a>(jobId) -> ParseResponse</code>

# Files

Types:

- <code><a href="./src/resources/files.ts">FileObject</a></code>
- <code><a href="./src/resources/files.ts">FileListResponse</a></code>

Methods:

- <code title="post /v1/files">client.files.<a href="./src/resources/files.ts">create</a>({ ...params }) -> FileObject</code>
- <code title="get /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">retrieve</a>(fileId) -> FileObject</code>
- <code title="put /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">update</a>(fileId, { ...params }) -> FileObject</code>
- <code title="get /v1/files">client.files.<a href="./src/resources/files.ts">list</a>({ ...params }) -> FileListResponse</code>
- <code title="get /v1/files/{file_id}/content">client.files.<a href="./src/resources/files.ts">content</a>(fileId) -> void</code>
- <code title="delete /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">del</a>(fileId) -> FileObject</code>

# Jobs

Types:

- <code><a href="./src/resources/jobs.ts">JobDeleteResponse</a></code>
- <code><a href="./src/resources/jobs.ts">JobStatusResponse</a></code>

Methods:

- <code title="get /v1/jobs/{job_id}">client.jobs.<a href="./src/resources/jobs.ts">retrieve</a>(jobId) -> JobStatusResponse</code>
- <code title="delete /v1/jobs/{job_id}">client.jobs.<a href="./src/resources/jobs.ts">delete</a>(jobId) -> JobDeleteResponse</code>

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
