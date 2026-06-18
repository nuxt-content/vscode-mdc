import { describe, expect, it } from 'vitest'
import {
  extractSlotsFromVue,
  extractSlotsFromSvelte,
  extractSlotsFromReact,
  extractSlotsFromAngular,
  getEnclosingComponent,
  isInsideYAMLBlock,
  isInsideCodeBlock,
  getExistingSlotNames,
  discoverSlotsFromDocument
} from '../../src/slot-completion-provider'

/**
 * Creates a minimal mock of vscode.TextDocument from an array of lines.
 */
function createMockDocument (lines: string[]) {
  return {
    lineAt (index: number) {
      return { text: lines[index] ?? '' }
    },
    lineCount: lines.length
  } as any
}

describe('extractSlotsFromVue', () => {
  it('extracts slots from defineSlots generic', () => {
    const content = `
<script setup lang="ts">
defineSlots<{
  header(): any
  footer(): any
  default(): any
}>()
</script>
`
    const slots = extractSlotsFromVue(content)
    expect(slots).toContain('header')
    expect(slots).toContain('footer')
    expect(slots).toContain('default')
  })

  it('extracts slots from <slot name="..."> tags', () => {
    const content = `
<template>
  <div>
    <slot name="header" />
    <slot name="body" />
    <slot />
  </div>
</template>
`
    const slots = extractSlotsFromVue(content)
    expect(slots).toContain('header')
    expect(slots).toContain('body')
  })

  it('extracts slots from both sources without duplicates', () => {
    const content = `
<script setup lang="ts">
defineSlots<{
  header(): any
}>()
</script>
<template>
  <slot name="header" />
  <slot name="sidebar" />
</template>
`
    const slots = extractSlotsFromVue(content)
    expect(slots).toContain('header')
    expect(slots).toContain('sidebar')
    // header should only appear once
    expect(slots.filter(s => s === 'header')).toHaveLength(1)
  })

  it('returns empty array for component with no slots', () => {
    const content = `
<template>
  <div>Hello</div>
</template>
`
    expect(extractSlotsFromVue(content)).toEqual([])
  })
})

describe('extractSlotsFromSvelte', () => {
  it('extracts named <slot> tags', () => {
    const content = `
<div>
  <slot name="header" />
  <slot name="footer" />
</div>
`
    const slots = extractSlotsFromSvelte(content)
    expect(slots).toContain('header')
    expect(slots).toContain('footer')
  })

  it('detects default slot from bare <slot />', () => {
    const content = `<div><slot /></div>`
    expect(extractSlotsFromSvelte(content)).toContain('default')
  })

  it('detects default slot from <slot>', () => {
    const content = `<div><slot>fallback</slot></div>`
    expect(extractSlotsFromSvelte(content)).toContain('default')
  })

  it('extracts Svelte 5 snippet slots', () => {
    const content = `
{#snippet header(props)}
  <h1>{props.title}</h1>
{/snippet}

{#snippet footer()}
  <p>Footer</p>
{/snippet}
`
    const slots = extractSlotsFromSvelte(content)
    expect(slots).toContain('header')
    expect(slots).toContain('footer')
  })

  it('returns empty array for component with no slots', () => {
    const content = `<div>Hello</div>`
    expect(extractSlotsFromSvelte(content)).toEqual([])
  })
})

describe('extractSlotsFromReact', () => {
  it('extracts ReactNode properties from interface', () => {
    const content = `
interface Props {
  header: ReactNode
  footer?: ReactNode
  children: ReactNode
}
`
    const slots = extractSlotsFromReact(content)
    expect(slots).toContain('header')
    expect(slots).toContain('footer')
    expect(slots).toContain('default')
  })

  it('extracts React.ReactNode properties', () => {
    const content = `
type Props = {
  sidebar: React.ReactNode
}
`
    const slots = extractSlotsFromReact(content)
    expect(slots).toContain('sidebar')
  })

  it('maps children to default slot', () => {
    const content = `
function Card({ children }: Props) {
  return <div>{children}</div>
}
`
    expect(extractSlotsFromReact(content)).toContain('default')
  })

  it('maps props.children to default slot', () => {
    const content = `
function Card(props: Props) {
  return <div>{props.children}</div>
}
`
    expect(extractSlotsFromReact(content)).toContain('default')
  })

  it('converts camelCase prop names to kebab-case', () => {
    const content = `
interface Props {
  sidebarContent: ReactNode
}
`
    const slots = extractSlotsFromReact(content)
    expect(slots).toContain('sidebar-content')
  })

  it('returns empty array for component with no ReactNode props', () => {
    const content = `
interface Props {
  title: string
  count: number
}
`
    expect(extractSlotsFromReact(content)).toEqual([])
  })
})

describe('extractSlotsFromAngular', () => {
  it('extracts slots from attribute selectors', () => {
    const content = `
<ng-content select="[header]"></ng-content>
<ng-content select="[footer]"></ng-content>
`
    const slots = extractSlotsFromAngular(content)
    expect(slots).toContain('header')
    expect(slots).toContain('footer')
  })

  it('extracts slots from class selectors', () => {
    const content = `
<ng-content select=".sidebar"></ng-content>
`
    expect(extractSlotsFromAngular(content)).toContain('sidebar')
  })

  it('detects default slot from bare <ng-content>', () => {
    const content = `<ng-content></ng-content>`
    expect(extractSlotsFromAngular(content)).toContain('default')
  })

  it('detects default slot from self-closing <ng-content />', () => {
    const content = `<ng-content />`
    expect(extractSlotsFromAngular(content)).toContain('default')
  })

  it('converts camelCase selectors to kebab-case', () => {
    const content = `<ng-content select="[sidebarContent]"></ng-content>`
    expect(extractSlotsFromAngular(content)).toContain('sidebar-content')
  })

  it('extracts from inline Angular component template', () => {
    const content = `
@Component({
  template: \`
    <ng-content select="[header]"></ng-content>
    <ng-content></ng-content>
  \`
})
export class CardComponent {}
`
    const slots = extractSlotsFromAngular(content)
    expect(slots).toContain('header')
    expect(slots).toContain('default')
  })

  it('returns empty array for component with no ng-content', () => {
    const content = `<div>Hello</div>`
    expect(extractSlotsFromAngular(content)).toEqual([])
  })
})

describe('getEnclosingComponent', () => {
  it('returns the component name when inside a block component', () => {
    const doc = createMockDocument([
      '::card',
      'Some content',
      '#header',
      ''
    ])
    expect(getEnclosingComponent(doc, 2)).toBe('card')
  })

  it('returns undefined when not inside any component', () => {
    const doc = createMockDocument([
      'Just some text',
      'More text'
    ])
    expect(getEnclosingComponent(doc, 1)).toBeUndefined()
  })

  it('returns the innermost component when nested', () => {
    const doc = createMockDocument([
      '::outer',
      ':::inner',
      '#slot',
      ''
    ])
    expect(getEnclosingComponent(doc, 2)).toBe('inner')
  })

  it('returns undefined after component is closed', () => {
    const doc = createMockDocument([
      '::card',
      'Content',
      '::',
      'Outside'
    ])
    expect(getEnclosingComponent(doc, 3)).toBeUndefined()
  })

  it('handles multiple sequential components', () => {
    const doc = createMockDocument([
      '::first',
      'Content',
      '::',
      '::second',
      'More content'
    ])
    expect(getEnclosingComponent(doc, 4)).toBe('second')
  })
})

describe('isInsideYAMLBlock', () => {
  it('returns true when inside a YAML block', () => {
    const doc = createMockDocument([
      '---',
      'title: Hello',
      '---'
    ])
    expect(isInsideYAMLBlock(doc, 1)).toBe(true)
  })

  it('returns false when outside YAML block', () => {
    const doc = createMockDocument([
      '---',
      'title: Hello',
      '---',
      'Content here'
    ])
    expect(isInsideYAMLBlock(doc, 3)).toBe(false)
  })

  it('returns false when no YAML delimiters exist', () => {
    const doc = createMockDocument([
      'Just text',
      'More text'
    ])
    expect(isInsideYAMLBlock(doc, 1)).toBe(false)
  })

  it('handles nested YAML blocks (toggle)', () => {
    const doc = createMockDocument([
      '---',
      'title: Hello',
      '---',
      'Content',
      '---',
      'more: yaml',
      '---'
    ])
    expect(isInsideYAMLBlock(doc, 5)).toBe(true)
  })
})

describe('isInsideCodeBlock', () => {
  it('returns true inside a backtick code block', () => {
    const doc = createMockDocument([
      '```ts',
      'const x = 1',
      '```'
    ])
    expect(isInsideCodeBlock(doc, 1)).toBe(true)
  })

  it('returns false outside a code block', () => {
    const doc = createMockDocument([
      '```ts',
      'const x = 1',
      '```',
      'Regular text'
    ])
    expect(isInsideCodeBlock(doc, 3)).toBe(false)
  })

  it('returns true inside a tilde code block', () => {
    const doc = createMockDocument([
      '~~~js',
      'let y = 2',
      '~~~'
    ])
    expect(isInsideCodeBlock(doc, 1)).toBe(true)
  })

  it('returns false when no code blocks exist', () => {
    const doc = createMockDocument([
      'Just text'
    ])
    expect(isInsideCodeBlock(doc, 0)).toBe(false)
  })
})

describe('getExistingSlotNames', () => {
  it('collects slot names used within the enclosing component', () => {
    const doc = createMockDocument([
      '::card',
      '#header',
      'Header content',
      '#footer',
      'Footer content',
      ''
    ])
    const existing = getExistingSlotNames(doc, 5)
    expect(existing.has('header')).toBe(true)
    expect(existing.has('footer')).toBe(true)
  })

  it('returns empty set when no slots are used', () => {
    const doc = createMockDocument([
      '::card',
      'Just content',
      ''
    ])
    const existing = getExistingSlotNames(doc, 2)
    expect(existing.size).toBe(0)
  })

  it('does not include slots from a different component scope', () => {
    const doc = createMockDocument([
      '::first',
      '#header',
      '::',
      '::second',
      ''
    ])
    const existing = getExistingSlotNames(doc, 4)
    expect(existing.has('header')).toBe(false)
  })
})

describe('discoverSlotsFromDocument', () => {
  it('discovers slots used in instances of the target component', () => {
    const doc = createMockDocument([
      '::card',
      '#header',
      'Header content',
      '#footer',
      'Footer content',
      '::'
    ])
    const slots = discoverSlotsFromDocument(doc, 'card')
    expect(slots).toContain('header')
    expect(slots).toContain('footer')
  })

  it('returns empty array when no matching component is found', () => {
    const doc = createMockDocument([
      '::other',
      '#sidebar',
      '::'
    ])
    expect(discoverSlotsFromDocument(doc, 'card')).toEqual([])
  })

  it('discovers slots from multiple instances of the same component', () => {
    const doc = createMockDocument([
      '::card',
      '#header',
      '::',
      '::card',
      '#footer',
      '::'
    ])
    const slots = discoverSlotsFromDocument(doc, 'card')
    expect(slots).toContain('header')
    expect(slots).toContain('footer')
  })

  it('ignores slots from different components', () => {
    const doc = createMockDocument([
      '::card',
      '#header',
      '::',
      '::alert',
      '#icon',
      '::'
    ])
    const slots = discoverSlotsFromDocument(doc, 'card')
    expect(slots).toContain('header')
    expect(slots).not.toContain('icon')
  })

  it('returns deduplicated slot names', () => {
    const doc = createMockDocument([
      '::card',
      '#header',
      '::',
      '::card',
      '#header',
      '::'
    ])
    const slots = discoverSlotsFromDocument(doc, 'card')
    expect(slots.filter(s => s === 'header')).toHaveLength(1)
  })
})
