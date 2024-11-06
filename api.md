# Mixedbread

Types:

- <code><a href="./src/resources/top-level.ts">EmbedResponse</a></code>
- <code><a href="./src/resources/top-level.ts">RerankResponse</a></code>
- <code><a href="./src/resources/top-level.ts">StatusResponse</a></code>

Methods:

- <code title="post /v1/embeddings">client.<a href="./src/index.ts">embed</a>({ ...params }) -> EmbedResponse</code>
- <code title="post /v1/reranking">client.<a href="./src/index.ts">rerank</a>({ ...params }) -> RerankResponse</code>
- <code title="get /">client.<a href="./src/index.ts">status</a>() -> StatusResponse</code>

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
- <code title="put /v1/files/{file_id}">client.files.<a href="./src/resources/files.ts">update</a>(fileId, { ...params }) -> FileObject</code>
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
