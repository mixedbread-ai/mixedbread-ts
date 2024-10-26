# Mixedbread

Types:

- <code><a href="./src/resources/top-level.ts">BaseStatusCheckResponse</a></code>

Methods:

- <code title="get /">client.<a href="./src/index.ts">baseStatusCheck</a>() -> BaseStatusCheckResponse</code>

# DocAI

## Parse

Types:

- <code><a href="./src/resources/doc-ai/parse.ts">ParseResponse</a></code>

Methods:

- <code title="post /v1/document-intelligence/parse">client.docAI.parse.<a href="./src/resources/doc-ai/parse.ts">createJob</a>({ ...params }) -> ParseResponse</code>
- <code title="get /v1/document-intelligence/parse/{job_id}">client.docAI.parse.<a href="./src/resources/doc-ai/parse.ts">retrieveJob</a>(jobId) -> ParseResponse</code>

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

- <code><a href="./src/resources/files/files.ts">FileObject</a></code>
- <code><a href="./src/resources/files/files.ts">FileListResponse</a></code>

Methods:

- <code title="post /v1/files">client.files.<a href="./src/resources/files/files.ts">create</a>({ ...params }) -> FileObject</code>
- <code title="get /v1/files/{file_id}">client.files.<a href="./src/resources/files/files.ts">retrieve</a>(fileId) -> FileObject</code>
- <code title="put /v1/files/{file_id}">client.files.<a href="./src/resources/files/files.ts">update</a>(fileId, { ...params }) -> FileObject</code>
- <code title="get /v1/files">client.files.<a href="./src/resources/files/files.ts">list</a>({ ...params }) -> FileListResponse</code>
- <code title="delete /v1/files/{file_id}">client.files.<a href="./src/resources/files/files.ts">delete</a>(fileId) -> FileObject</code>

## Content

Methods:

- <code title="get /v1/files/{file_id}/content">client.files.content.<a href="./src/resources/files/content.ts">retrieve</a>(fileId) -> Response</code>

# Jobs

Types:

- <code><a href="./src/resources/jobs.ts">JobStatusResponse</a></code>
- <code><a href="./src/resources/jobs.ts">JobDeleteResponse</a></code>

Methods:

- <code title="get /v1/jobs/{job_id}">client.jobs.<a href="./src/resources/jobs.ts">retrieve</a>(jobId) -> JobStatusResponse</code>
- <code title="delete /v1/jobs/{job_id}">client.jobs.<a href="./src/resources/jobs.ts">delete</a>(jobId) -> JobDeleteResponse</code>
