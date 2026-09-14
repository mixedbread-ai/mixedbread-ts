# Contributing

This repository holds the source of `@mixedbread/sdk on npm`. The code is generated from Mixedbread's OpenAPI
specification inside our monorepo and mirrored here on every change, one commit per monorepo
commit; a GitHub release is created whenever the version changes, and the workflow in this
repository publishes it.

Because of that, pull requests against this repository cannot be merged: the next mirror would
overwrite them. Instead:

- **Bugs and feature requests**: open an issue here. We port the change into the monorepo, and it
  shows up here with the next mirror.
- **Hand-written helpers** (under `src/lib/`): also welcome as an issue or a PR that we use as a
  reference while porting.

Every mirrored commit has passed the monorepo's checks: generator tests, freshness of the
generated code against the specification, lint, type checks and the test suite against a mock
server. The `CI` workflow here repeats lint, type checks and the build.
