# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## v0.5.0

[compare changes](https://github.com/nuxtlabs/vscode-mdc/compare/v0.4.2...v0.5.0)

### 🚀 Enhancements

- Format on paste ([#80](https://github.com/nuxtlabs/vscode-mdc/pull/80))
- Mdc block component tag matching and highlighting ([#77](https://github.com/nuxtlabs/vscode-mdc/pull/77))

### 🩹 Fixes

- Component metadata ttl ([#76](https://github.com/nuxtlabs/vscode-mdc/pull/76))
- Upgrade esno for build ([#79](https://github.com/nuxtlabs/vscode-mdc/pull/79))
- `while` pattern to match indent in lists ([#81](https://github.com/nuxtlabs/vscode-mdc/pull/81))

### 🏡 Chore

- Upgrade deps and tests ([32be6d6](https://github.com/nuxtlabs/vscode-mdc/commit/32be6d6))
- Upgrade `@nuxt/schema` ([de71c3a](https://github.com/nuxtlabs/vscode-mdc/commit/de71c3a))

### 🤖 CI

- Upgrade actions ([e492b9e](https://github.com/nuxtlabs/vscode-mdc/commit/e492b9e))

### ❤️ Contributors

- Farnabaz <farnabaz@gmail.com>
- Adam DeHaven ([@adamdehaven](https://github.com/adamdehaven))
- Aymkx ([@aymkx](https://github.com/aymkx))

## v0.4.2

[compare changes](https://github.com/nuxtlabs/vscode-mdc/compare/v0.4.1...v0.4.2)

### 🩹 Fixes

- **deps:** Update mdc formatter for dynamic props ([#60](https://github.com/nuxtlabs/vscode-mdc/pull/60))

### ❤️ Contributors

- Adam DeHaven ([@adamdehaven](https://github.com/adamdehaven))

## v0.4.1

[compare changes](https://github.com/nuxtlabs/vscode-mdc/compare/v0.4.0...v0.4.1)

### 🏡 Chore

- Exclude types from build ([c580313](https://github.com/nuxtlabs/vscode-mdc/commit/c580313))

### ❤️ Contributors

- Farnabaz <farnabaz@gmail.com>

## v0.4.0

[compare changes](https://github.com/nuxtlabs/vscode-mdc/compare/v0.3.3...v0.4.0)

### 🚀 Enhancements

- **completions:** Array prop completion formats ([#57](https://github.com/nuxtlabs/vscode-mdc/pull/57))

### 🩹 Fixes

- **deps:** Update monarch-mdc ([#58](https://github.com/nuxtlabs/vscode-mdc/pull/58))

### ✅ Tests

- Init extension test ([b9f9e54](https://github.com/nuxtlabs/vscode-mdc/commit/b9f9e54))

### ❤️ Contributors

- Farnabaz <farnabaz@gmail.com>
- Adam DeHaven ([@adamdehaven](https://github.com/adamdehaven))

## v0.3.3

[compare changes](https://github.com/nuxtlabs/vscode-mdc/compare/v0.3.2...v0.3.3)

### 🩹 Fixes

- **deps:** Update monarch-mdc for formatter fixes ([#56](https://github.com/nuxtlabs/vscode-mdc/pull/56))

### ❤️ Contributors

- Adam DeHaven ([@adamdehaven](https://github.com/adamdehaven))

## v0.3.2

[compare changes](https://github.com/nuxtlabs/vscode-mdc/compare/v0.3.1...v0.3.2)

### 🩹 Fixes

- **deps:** Update monarch-mdc for formatter fixes ([#55](https://github.com/nuxtlabs/vscode-mdc/pull/55))

### 📖 Documentation

- Fix syntax reference link ([#54](https://github.com/nuxtlabs/vscode-mdc/pull/54))

### ❤️ Contributors

- Adam DeHaven ([@adamdehaven](https://github.com/adamdehaven))
- Yue JIN ([@kingyue737](https://github.com/kingyue737))

## v0.3.1

[compare changes](https://github.com/nuxtlabs/vscode-mdc/compare/v0.3.0...v0.3.1)

### 🤖 CI

- Enable dependencies on published versions ([1379070](https://github.com/nuxtlabs/vscode-mdc/commit/1379070))

### ❤️ Contributors

- Farnabaz <farnabaz@gmail.com>

## v0.3.0

[compare changes](https://github.com/nuxtlabs/vscode-mdc/compare/v0.2.4...v0.3.0)

### 🚀 Enhancements

- Component and prop suggestions ([#43](https://github.com/nuxtlabs/vscode-mdc/pull/43))

### 🩹 Fixes

- **completions:** Prop type value ([#50](https://github.com/nuxtlabs/vscode-mdc/pull/50))
- **completions:** Detect object prop type ([#51](https://github.com/nuxtlabs/vscode-mdc/pull/51))

### 🤖 CI

- Deploy to open vsx ([95a5f06](https://github.com/nuxtlabs/vscode-mdc/commit/95a5f06))

### ❤️ Contributors

- Farnabaz <farnabaz@gmail.com>
- Adam DeHaven ([@adamdehaven](https://github.com/adamdehaven))

## v0.2.4

[compare changes](https://github.com/nuxtlabs/vscode-mdc/compare/v0.2.3...v0.2.4)

### 🩹 Fixes

- Show markdown preview menus ([#49](https://github.com/nuxtlabs/vscode-mdc/pull/49))

### ❤️ Contributors

- Farnabaz <farnabaz@gmail.com>

## v0.2.3

### [0.2.3](https://github.com/nuxtlabs/vscode-mdc/compare/v0.2.0...v0.2.3) (2025-03-04)


> [!IMPORTANT]
>  As of this version, the extension introduces executable code to format and fold documents ([#41](https://github.com/nuxtlabs/vscode-mdc/issues/41)). Due to this change, VSCode auto-update does not update the extension automatically; you need to manually update it. 

### 🚀 Features

* add document formatting and code folding providers ([#41](https://github.com/nuxtlabs/vscode-mdc/issues/41)) ([866de6e](https://github.com/nuxtlabs/vscode-mdc/commit/866de6e93440afc6f42594610ef1d0c22b661123))


### 🩹 Bug Fixes

*  create `mdc.standalone` to use separately outside of markdown language ([45d4f42](https://github.com/nuxtlabs/vscode-mdc/commit/45d4f426aa51b8d6a6b2e719ed2bc8f617bd3919))
* **formatting:** make formatting opt-in ([#45](https://github.com/nuxtlabs/vscode-mdc/issues/45)) ([58a8bed](https://github.com/nuxtlabs/vscode-mdc/commit/58a8bedde552f14e89cc48b47606e077f2ee3e02))
* **packaging:** properly package dependencies ([#46](https://github.com/nuxtlabs/vscode-mdc/issues/46)) ([545791f](https://github.com/nuxtlabs/vscode-mdc/commit/545791f11561c4ce37ab5e7e9dc5959343613686))
* **standalone:** include inline syntax ([#42](https://github.com/nuxtlabs/vscode-mdc/issues/42)) ([96f619c](https://github.com/nuxtlabs/vscode-mdc/commit/96f619ccd8df724e5bd94eb28b87e03b769a8c41))


## [0.2.0](https://github.com/nuxtlabs/vscode-mdc/compare/v0.1.8...v0.2.0) (2023-09-01)


### ⚠ BREAKING CHANGES

* project overhaul (#33)

### Features

* project overhaul ([#33](https://github.com/nuxtlabs/vscode-mdc/issues/33)) ([6294dbc](https://github.com/nuxtlabs/vscode-mdc/commit/6294dbce9706f538a521e7dccce9609e928dc3be))


### Bug Fixes

* **README.md:** MDC Syntax Reference link ([#31](https://github.com/nuxtlabs/vscode-mdc/issues/31)) ([5ff7fd7](https://github.com/nuxtlabs/vscode-mdc/commit/5ff7fd71a4e5c59b50962a1bd0ba0e50f66446d4))
* update icon ([#34](https://github.com/nuxtlabs/vscode-mdc/issues/34)) ([a18dea2](https://github.com/nuxtlabs/vscode-mdc/commit/a18dea2fb4263dff2d83866d596a7fe3573fca85))

### [0.1.8](https://github.com/nuxtlabs/vscode-mdc/compare/v0.1.7...v0.1.8) (2022-09-14)


### Features

* enable web extension ([2766128](https://github.com/nuxtlabs/vscode-mdc/commit/276612883090183f73598074e29930bc2dc8da0d))


### Bug Fixes

* **highlight:** broken highlighting of mustache syntax ([#27](https://github.com/nuxtlabs/vscode-mdc/issues/27)) ([7bf8ce3](https://github.com/nuxtlabs/vscode-mdc/commit/7bf8ce3dbda8f2d79431d80dc59c4e28b4fc745c))

### [0.1.7](https://github.com/nuxtlabs/vscode-mdc/compare/v0.1.4...v0.1.7) (2022-05-02)


### Features

* move to Nuxt and rename to MDC ([8e1b3d0](https://github.com/nuxtlabs/vscode-mdc/commit/8e1b3d04fae2883987c98c040ee5e98edfd7497f))


### Bug Fixes

* convert indendation to spaces ([e9f6fff](https://github.com/nuxtlabs/vscode-mdc/commit/e9f6fff0a2ffde4aee48850dbe1c8fb253fe9152))
* remove skipping tag ([0d0a2d2](https://github.com/nuxtlabs/vscode-mdc/commit/0d0a2d20a3d201c729a4f3f702a029809dceddd6))

### [0.1.6](https://github.com/nuxtlabs/vscode-mdc/compare/v0.1.4...v0.1.6) (2022-05-02)


### Features

* move to Nuxt and rename to MDC ([8e1b3d0](https://github.com/nuxtlabs/vscode-mdc/commit/8e1b3d04fae2883987c98c040ee5e98edfd7497f))


### Bug Fixes

* convert indendation to spaces ([e9f6fff](https://github.com/nuxtlabs/vscode-mdc/commit/e9f6fff0a2ffde4aee48850dbe1c8fb253fe9152))

### [0.1.5](https://github.com/nuxtlabs/vscode-mdc/compare/v0.1.4...v0.1.5) (2022-05-02)


### Features

* move to Nuxt and rename to MDC ([8e1b3d0](https://github.com/nuxtlabs/vscode-mdc/commit/8e1b3d04fae2883987c98c040ee5e98edfd7497f))

### [0.1.4](https://github.com/docusgen/vscode-extension/compare/v0.1.2...v0.1.4) (2021-11-11)


### Features

* init monarch grammar ([#3](https://github.com/docusgen/vscode-extension/issues/3)) ([e3350e6](https://github.com/docusgen/vscode-extension/commit/e3350e677c565daaa44aa8424dafca4d46f662ee))


### Bug Fixes

* activation events ([86c5123](https://github.com/docusgen/vscode-extension/commit/86c5123c303980f879a06b2b84f558b7dc63ce84))
* attributes colorring ([75eb0f5](https://github.com/docusgen/vscode-extension/commit/75eb0f5635ae90d144d83b18e4d5121acba50027)), closes [#18](https://github.com/docusgen/vscode-extension/issues/18)
* handle nested components ([fe3663a](https://github.com/docusgen/vscode-extension/commit/fe3663a45cc68199d6f5f9f3a6de3d491b75da71)), closes [#4](https://github.com/docusgen/vscode-extension/issues/4)
* improve block repository ([1303abd](https://github.com/docusgen/vscode-extension/commit/1303abd16342880a42a4d143a660da049c79ea6c))
* inline component attribute ([ca13391](https://github.com/docusgen/vscode-extension/commit/ca13391a6652a09ee5954573113101f96b04af68))
* support dash in slot name ([1c247d7](https://github.com/docusgen/vscode-extension/commit/1c247d701fe7139df9aaf6d92934a57b9447faf1)), closes [#4](https://github.com/docusgen/vscode-extension/issues/4)

### [0.1.3](https://github.com/docusgen/vscode-extension/compare/v0.1.2...v0.1.3) (2021-08-19)


### Bug Fixes

* support dash in slot name ([1c247d7](https://github.com/docusgen/vscode-extension/commit/1c247d701fe7139df9aaf6d92934a57b9447faf1)), closes [#4](https://github.com/docusgen/vscode-extension/issues/4)

### [0.1.2](https://github.com/docusgen/vscode-extension/compare/v0.1.1...v0.1.2) (2021-07-06)

### 0.1.1 (2021-07-06)


### Features

* add snippets ([150cea1](https://github.com/docusgen/vscode-extension/commit/150cea17170690f48ee89baab88a1934329c66a8))
* block slots ([8d3c8c8](https://github.com/docusgen/vscode-extension/commit/8d3c8c81148211866e22b9b6f60a3e89741d025f))
* highlight compoents sytax ([dfd6a60](https://github.com/docusgen/vscode-extension/commit/dfd6a608453599a2a7d05aa5ff3b636e95e90b99))
* span & inline components ([7b23c19](https://github.com/docusgen/vscode-extension/commit/7b23c199fc78a4db13450fd765048d6b432d8b0f))


### Bug Fixes

* attributes regex ([17f01f0](https://github.com/docusgen/vscode-extension/commit/17f01f0aea10c7b96a5d5114af4a31040b0f4678))
* improve block slot support ([8a60614](https://github.com/docusgen/vscode-extension/commit/8a60614600a9b0b05ca8f62693d48772eb7cedf8))
* prevent name conflict ([edf2d67](https://github.com/docusgen/vscode-extension/commit/edf2d67a25389184f0237eb9bdbadcf27ea3221b))
