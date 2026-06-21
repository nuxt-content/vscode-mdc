import { describe, expect, it, vi } from 'vitest'

vi.mock('vscode', () => ({
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

import { isInsideYAMLBlock, isInsideCodeBlock } from './document'

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
