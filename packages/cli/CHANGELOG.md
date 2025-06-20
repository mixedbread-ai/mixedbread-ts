# Changelog

## 0.1.3 (2025-06-20)

### Fixed

- Fixed "Cannot find module '../../package.json'" error when running via bunx/npx
- Implemented fallback logic to find package.json in both published and development environments

## 0.1.1 (2025-06-20)

Full Changelog: [v0.1.0...v0.1.1](https://github.com/mixedbread-ai/mixedbread-ts/compare/v0.1.0...v0.1.1)

### Fixed

- Fixed package build to include compiled JavaScript files
- Fixed `bunx @mixedbread/cli` execution error
- Updated package.json files array to properly include all built files when publishing from dist directory

## 0.1.0 (2025-06-19)

Full Changelog: [v0.0.1...v0.1.0](https://github.com/mixedbread-ai/mixedbread-ts/compare/v0.0.1...v0.1.0)

### Features

- add adjustments ([d220d27](https://github.com/mixedbread-ai/mixedbread-ts/commit/d220d27538c2b736f08ef5de3295ec0f5da4b59e))
- add adjustments to upload ([234bf21](https://github.com/mixedbread-ai/mixedbread-ts/commit/234bf21f4fa73227581784f7c81ec84796e0293a))
- add basic commands ([b4781bd](https://github.com/mixedbread-ai/mixedbread-ts/commit/b4781bd749b433ac1f68021a6629a51a25619d25))
- add config command + fix upload + zod validation ([1e200fe](https://github.com/mixedbread-ai/mixedbread-ts/commit/1e200fe9cb89fc0289973aa06c698245de2089e4))
- add loading states to all commands ([6bc1086](https://github.com/mixedbread-ai/mixedbread-ts/commit/6bc1086c52b6383f2fdd1f24e857caa7e9594079))
- add manifest file upload ([099711a](https://github.com/mixedbread-ai/mixedbread-ts/commit/099711a089d2bd30bbcd16573ba620a20b449535))
- add more validations ([db8b305](https://github.com/mixedbread-ai/mixedbread-ts/commit/db8b3057b8852fd074140f38ce620e9f51aef2c4))
- add sync command ([b9dba48](https://github.com/mixedbread-ai/mixedbread-ts/commit/b9dba48ecfe8a8d97a328fc3ca3666108d1633f2))
- add tests for all commands ([bc821cb](https://github.com/mixedbread-ai/mixedbread-ts/commit/bc821cbe7fd5e71cd62b2c1559ddd92d3712abe0))
- add tests for qa and search ([4229d32](https://github.com/mixedbread-ai/mixedbread-ts/commit/4229d328689f1e228994564816f8004fb4f3a3a8))
- format metadata for table format ([0753ee9](https://github.com/mixedbread-ai/mixedbread-ts/commit/0753ee9fd5362ff3e410cc597bd2c16db8f25c1a))
- make search and qa commands work ([122966e](https://github.com/mixedbread-ai/mixedbread-ts/commit/122966eff090282210a53dace2cb4a5decb28574))
- update mixedbread sdk + treat vs name as identifier ([fb11dae](https://github.com/mixedbread-ai/mixedbread-ts/commit/fb11dae42a3b6cd4f91dae783f62ede9b9f9272a))

### Bug Fixes

- add adjustments ([d16e862](https://github.com/mixedbread-ai/mixedbread-ts/commit/d16e86202fa7a5a82d55c3fc9abed965147bcb19))
- fix git sync ([7fbee8c](https://github.com/mixedbread-ai/mixedbread-ts/commit/7fbee8cfc421e077369e8fdc510ac3131da37a12))
- fix lint ([a5e08e6](https://github.com/mixedbread-ai/mixedbread-ts/commit/a5e08e6aced6b7fe3f276142b84e439f89923cc6))
- fix lints ([3d2c934](https://github.com/mixedbread-ai/mixedbread-ts/commit/3d2c9343eed5e29e3adb4198177e6080d8482059))
- fix tests ([2cde2b0](https://github.com/mixedbread-ai/mixedbread-ts/commit/2cde2b0f99666fec5114672b6f39d681cfac6462))
- make help default command + fix local dev setup ([c294c98](https://github.com/mixedbread-ai/mixedbread-ts/commit/c294c98e58fd7ac038e3d416df06f6fbeef27ab7))
- use uuid for vs id ([c254dd8](https://github.com/mixedbread-ai/mixedbread-ts/commit/c254dd8112ff828348533a11e2eee4b4ad675c8c))

### Chores

- add biome ([46ae179](https://github.com/mixedbread-ai/mixedbread-ts/commit/46ae1796c3cbcf88777e94afb703c59174674381))
- format code ([84fdbe5](https://github.com/mixedbread-ai/mixedbread-ts/commit/84fdbe54232b189e097dc628a5adf6fe5f3f4272))
- lint ([630f13e](https://github.com/mixedbread-ai/mixedbread-ts/commit/630f13edf1d2a96b2c0e36c981db1079837b9846))
- make setup easier ([d7e4d5f](https://github.com/mixedbread-ai/mixedbread-ts/commit/d7e4d5f5bd2b29a55dc08c5a7247534971808866))
- separate files command into different files ([6d7317f](https://github.com/mixedbread-ai/mixedbread-ts/commit/6d7317f2f83f8f96b009cbf0a774fbdfae587597))
- update cli ([9844c6f](https://github.com/mixedbread-ai/mixedbread-ts/commit/9844c6fd5dcb983254784c633f18364328668b32))
- update github cli ([ec0a676](https://github.com/mixedbread-ai/mixedbread-ts/commit/ec0a676d7d32928255dc5d3b0903945cf2c12534))

### Documentation

- add readme file ([ff40842](https://github.com/mixedbread-ai/mixedbread-ts/commit/ff408428b2c632d1dcf1d5534373a20b1c013580))
- improve readme ([4b2104f](https://github.com/mixedbread-ai/mixedbread-ts/commit/4b2104faebe511969dd698be141eddaf568e28fd))
- update readme ([af8ed17](https://github.com/mixedbread-ai/mixedbread-ts/commit/af8ed178fde9bd0c5da02b5ae3c0f22ec699cbee))

### Styles

- format code ([f0fe73b](https://github.com/mixedbread-ai/mixedbread-ts/commit/f0fe73b0015e9448670ebaf40f71f184b427bc62))

### Refactors

- add formatCountWithSuffix function ([c63dc8c](https://github.com/mixedbread-ai/mixedbread-ts/commit/c63dc8c41e42fed8ad20d01d053bdb2edec117f3))
- separate validating metadata as a function ([7f95f63](https://github.com/mixedbread-ai/mixedbread-ts/commit/7f95f63373c1aa091a5c79867c7372731cea8687))

## 0.0.1 (2025-06-19)

Full Changelog: [...v0.0.1](https://github.com/mixedbread-ai/mixedbread-ts/compare/...v0.0.1)

### Features

- add adjustments ([d220d27](https://github.com/mixedbread-ai/mixedbread-ts/commit/d220d27538c2b736f08ef5de3295ec0f5da4b59e))
- add adjustments to upload ([234bf21](https://github.com/mixedbread-ai/mixedbread-ts/commit/234bf21f4fa73227581784f7c81ec84796e0293a))
- add basic commands ([b4781bd](https://github.com/mixedbread-ai/mixedbread-ts/commit/b4781bd749b433ac1f68021a6629a51a25619d25))
- add config command + fix upload + zod validation ([1e200fe](https://github.com/mixedbread-ai/mixedbread-ts/commit/1e200fe9cb89fc0289973aa06c698245de2089e4))
- add loading states to all commands ([6bc1086](https://github.com/mixedbread-ai/mixedbread-ts/commit/6bc1086c52b6383f2fdd1f24e857caa7e9594079))
- add manifest file upload ([099711a](https://github.com/mixedbread-ai/mixedbread-ts/commit/099711a089d2bd30bbcd16573ba620a20b449535))
- add more validations ([db8b305](https://github.com/mixedbread-ai/mixedbread-ts/commit/db8b3057b8852fd074140f38ce620e9f51aef2c4))
- add sync command ([b9dba48](https://github.com/mixedbread-ai/mixedbread-ts/commit/b9dba48ecfe8a8d97a328fc3ca3666108d1633f2))
- add tests for all commands ([bc821cb](https://github.com/mixedbread-ai/mixedbread-ts/commit/bc821cbe7fd5e71cd62b2c1559ddd92d3712abe0))
- add tests for qa and search ([4229d32](https://github.com/mixedbread-ai/mixedbread-ts/commit/4229d328689f1e228994564816f8004fb4f3a3a8))
- format metadata for table format ([0753ee9](https://github.com/mixedbread-ai/mixedbread-ts/commit/0753ee9fd5362ff3e410cc597bd2c16db8f25c1a))
- make search and qa commands work ([122966e](https://github.com/mixedbread-ai/mixedbread-ts/commit/122966eff090282210a53dace2cb4a5decb28574))
- update mixedbread sdk + treat vs name as identifier ([fb11dae](https://github.com/mixedbread-ai/mixedbread-ts/commit/fb11dae42a3b6cd4f91dae783f62ede9b9f9272a))

### Bug Fixes

- add adjustments ([d16e862](https://github.com/mixedbread-ai/mixedbread-ts/commit/d16e86202fa7a5a82d55c3fc9abed965147bcb19))
- fix git sync ([7fbee8c](https://github.com/mixedbread-ai/mixedbread-ts/commit/7fbee8cfc421e077369e8fdc510ac3131da37a12))
- fix lint ([a5e08e6](https://github.com/mixedbread-ai/mixedbread-ts/commit/a5e08e6aced6b7fe3f276142b84e439f89923cc6))
- fix lints ([3d2c934](https://github.com/mixedbread-ai/mixedbread-ts/commit/3d2c9343eed5e29e3adb4198177e6080d8482059))
- fix tests ([2cde2b0](https://github.com/mixedbread-ai/mixedbread-ts/commit/2cde2b0f99666fec5114672b6f39d681cfac6462))
- make help default command + fix local dev setup ([c294c98](https://github.com/mixedbread-ai/mixedbread-ts/commit/c294c98e58fd7ac038e3d416df06f6fbeef27ab7))
- use uuid for vs id ([c254dd8](https://github.com/mixedbread-ai/mixedbread-ts/commit/c254dd8112ff828348533a11e2eee4b4ad675c8c))

### Chores

- add biome ([46ae179](https://github.com/mixedbread-ai/mixedbread-ts/commit/46ae1796c3cbcf88777e94afb703c59174674381))
- format code ([84fdbe5](https://github.com/mixedbread-ai/mixedbread-ts/commit/84fdbe54232b189e097dc628a5adf6fe5f3f4272))
- lint ([630f13e](https://github.com/mixedbread-ai/mixedbread-ts/commit/630f13edf1d2a96b2c0e36c981db1079837b9846))
- make setup easier ([d7e4d5f](https://github.com/mixedbread-ai/mixedbread-ts/commit/d7e4d5f5bd2b29a55dc08c5a7247534971808866))
- separate files command into different files ([6d7317f](https://github.com/mixedbread-ai/mixedbread-ts/commit/6d7317f2f83f8f96b009cbf0a774fbdfae587597))
- update cli ([9844c6f](https://github.com/mixedbread-ai/mixedbread-ts/commit/9844c6fd5dcb983254784c633f18364328668b32))
- update github cli ([ec0a676](https://github.com/mixedbread-ai/mixedbread-ts/commit/ec0a676d7d32928255dc5d3b0903945cf2c12534))

### Documentation

- add readme file ([ff40842](https://github.com/mixedbread-ai/mixedbread-ts/commit/ff408428b2c632d1dcf1d5534373a20b1c013580))
- improve readme ([4b2104f](https://github.com/mixedbread-ai/mixedbread-ts/commit/4b2104faebe511969dd698be141eddaf568e28fd))
- update readme ([af8ed17](https://github.com/mixedbread-ai/mixedbread-ts/commit/af8ed178fde9bd0c5da02b5ae3c0f22ec699cbee))

### Styles

- format code ([f0fe73b](https://github.com/mixedbread-ai/mixedbread-ts/commit/f0fe73b0015e9448670ebaf40f71f184b427bc62))

### Refactors

- add formatCountWithSuffix function ([c63dc8c](https://github.com/mixedbread-ai/mixedbread-ts/commit/c63dc8c41e42fed8ad20d01d053bdb2edec117f3))
- separate validating metadata as a function ([7f95f63](https://github.com/mixedbread-ai/mixedbread-ts/commit/7f95f63373c1aa091a5c79867c7372731cea8687))
