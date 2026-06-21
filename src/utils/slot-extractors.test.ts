import { describe, expect, it } from 'vitest'
import {
  extractSlotsFromVue,
  extractSlotsFromSvelte,
  extractSlotsFromReact,
  extractSlotsFromAngular
} from './slot-extractors'

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
    expect(extractSlotsFromReact(content)).toContain('sidebar')
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
    expect(extractSlotsFromReact(content)).toContain('sidebar-content')
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
