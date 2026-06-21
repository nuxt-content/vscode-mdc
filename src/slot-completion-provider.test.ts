import { describe, expect, it, vi } from 'vitest'

vi.mock('vscode', () => ({
  CompletionItemKind: { Field: 5 },
  CompletionItem: class {},
  SnippetString: class { constructor (public value: string) {} },
  MarkdownString: class { constructor (public value: string) {} },
  Range: class {
    constructor (
      public startLine: number,
      public startChar: number,
      public endLine: number,
      public endChar: number
    ) {}
  },
  workspace: {
    workspaceFolders: [],
    textDocuments: [],
    getConfiguration: () => ({ get: () => undefined }),
    findFiles: async () => [],
    fs: { readFile: async () => new Uint8Array() }
  },
  window: {
    showInformationMessage: () => {},
    showErrorMessage: () => {}
  }
}))

import {
  getEnclosingComponent,
  getExistingSlotNames,
  discoverSlotsFromDocument
} from './slot-completion-provider'

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

  it('handles closing with 3+ colons', () => {
    const doc = createMockDocument([
      ':::card',
      'Content',
      ':::',
      'Outside'
    ])
    expect(getEnclosingComponent(doc, 3)).toBeUndefined()
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
