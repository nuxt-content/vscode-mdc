# Hello

_Hello_ **World** from [`vscode-comark`](https://github.com/comarkdown/vscode-comark)

> This file contains the basic Markdown Components syntax

::hero
  :::card
    A nested card

    ::::card { title="Card title" .red}
      A **super** nested card
    ::::
  :::
::

::hero
Default slot text

#description
This will be rendered inside the `description` slot.
::

- [x] List A
- [ ] List B
  - [ ] List B.1

![](/af-logo-animated.svg){.w-30.mt--10.mb-5}

## Hello{.text-red}

Hello World{class="text-green text-xl"}

[Link](https://nuxt.com){class="nuxt"}

![Nuxt Logo](https://nuxt.com/assets/design-kit/logo/icon-green.svg){#nuxt-logo}

`code`{style="color: red"}

_italic_{style="color: blue"}

**bold**{style="color: blue"}

```bash
npm i nuxt
```

```ts
import MarkdownIt from 'markdown-it'
import mdc from 'markdown-it-mdc'

// :warning: this line should not be transformed
const md = new MarkdownIt()
  .use(mdc)
```

<Counter :count="1" />

<CustomComponent>
  Nested <Counter @click="foo" />
</CustomComponent>

<style scoped>
  .mdc-button {
    background-color: #ff0000;
  }
</style>
