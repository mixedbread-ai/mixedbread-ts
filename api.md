# BaseStatus

Types:

- <code><a href="./src/resources/base-status.ts">InfoResponse</a></code>

Methods:

- <code title="get /">client.baseStatus.<a href="./src/resources/base-status.ts">retrieve</a>() -> InfoResponse</code>

# DocumentIntelligence

## Parse

Types:

- <code><a href="./src/resources/document-intelligence/parse.ts">ParseResponse</a></code>

Methods:

- <code title="post /v1/document-intelligence/parse">client.documentIntelligence.parse.<a href="./src/resources/document-intelligence/parse.ts">create</a>({ ...params }) -> ParseResponse</code>
- <code title="get /v1/document-intelligence/parse/{job_id}">client.documentIntelligence.parse.<a href="./src/resources/document-intelligence/parse.ts">retrieve</a>(jobId) -> ParseResponse</code>

# Files

Types:

- <code><a href="./src/resources/files/files.ts">FileListResponse</a></code>
- <code><a href="./src/resources/files/files.ts">FileResponse</a></code>
- <code><a href="./src/resources/files/files.ts">FileUpdateResponse</a></code>

Methods:

- <code title="post /v1/files">client.files.<a href="./src/resources/files/files.ts">create</a>({ ...params }) -> FileResponse</code>
- <code title="get /v1/files/{file_id}">client.files.<a href="./src/resources/files/files.ts">retrieve</a>(fileId) -> FileResponse</code>
- <code title="put /v1/files/{file_id}">client.files.<a href="./src/resources/files/files.ts">update</a>(fileId, { ...params }) -> FileUpdateResponse</code>
- <code title="get /v1/files">client.files.<a href="./src/resources/files/files.ts">list</a>() -> FileListResponse</code>
- <code title="delete /v1/files/{file_id}">client.files.<a href="./src/resources/files/files.ts">delete</a>(fileId) -> void</code>

## Content

Types:

- <code><a href="./src/resources/files/content.ts">ContentRetrieveResponse</a></code>

Methods:

- <code title="get /v1/files/{file_id}/content">client.files.content.<a href="./src/resources/files/content.ts">retrieve</a>(fileId) -> unknown</code>

# Jobs

Types:

- <code><a href="./src/resources/jobs/jobs.ts">JobDeleteResponse</a></code>
- <code><a href="./src/resources/jobs/jobs.ts">JobStatusResponse</a></code>

Methods:

- <code title="delete /v1/jobs/{job_id}">client.jobs.<a href="./src/resources/jobs/jobs.ts">delete</a>(jobId) -> JobDeleteResponse</code>

## Status

Methods:

- <code title="get /v1/jobs/{job_id}">client.jobs.status.<a href="./src/resources/jobs/status.ts">retrieve</a>(jobId) -> JobStatusResponse</code>
