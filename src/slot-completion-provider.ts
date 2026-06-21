import { kebabCase, pascalCase } from 'scule'
import * as vscode from 'vscode'
import type { MDCComponentData } from './completion-providers'
import { logger } from './logger'
import { isInsideYAMLBlock, isInsideCodeBlock } from './utils/document'
import { extractSlotsFromVue, extractSlotsFromSvelte, extractSlotsFromReact, extractSlotsFromAngular } from './utils/slot-extractors'

/** Regex to match block component opening lines */
const MDC_COMPONENT_START_REGEX = /^\s*:{2,}([\w-]+)/
/** Regex to match block component closing lines (2+ colons with no name) */
const MDC_COMPONENT_END_REGEX = /^\s*:{2,}\s*$/
const SLOT_PATTERN = /^\s*#([\w-]+)/

/** Cache for component file slot discovery results (keyed by component name) */
const componentFileSlotCache = new Map<string, { slots: string[], timestamp: number }>()
/** TTL for component file slot cache entries (5 minutes) */
const SLOT_CACHE_TTL_MS = 5 * 60 * 1000

/**
 * Invalidates the component file slot cache.
 * Should be called when workspace files change.
 */
export function invalidateSlotCache (): void {
  componentFileSlotCache.clear()
}

/**
 * Walks backwards from the cursor to find the enclosing block component name.
 *
 * @param {vscode.TextDocument} document - The VS Code text document
 * @param {number} lineNumber - The 0-based line number of the current cursor position
 * @returns {string | undefined} - The component name or undefined if not inside a component
 */
export function getEnclosingComponent (document: vscode.TextDocument, lineNumber: number): string | undefined {
  const componentStack: string[] = []

  for (let i = 0; i <= lineNumber; i++) {
    const line = document.lineAt(i).text.trim()
    if (!line) {
      continue
    }

    const startMatch = line.match(MDC_COMPONENT_START_REGEX)
    if (startMatch) {
      componentStack.push(startMatch[1])
      continue
    }

    if (MDC_COMPONENT_END_REGEX.test(line)) {
      componentStack.pop()
    }
  }

  return componentStack[componentStack.length - 1]
}

/**
 * Collects slot names already used in the current block component scope.
 *
 * @param {vscode.TextDocument} document - The VS Code text document
 * @param {number} lineNumber - The 0-based line number of the current cursor position
 * @returns {Set<string>} - Set of slot names already used in the enclosing component
 */
export function getExistingSlotNames (document: vscode.TextDocument, lineNumber: number): Set<string> {
  const existing = new Set<string>()

  const stack: number[] = []
  for (let i = 0; i <= lineNumber; i++) {
    const line = document.lineAt(i).text.trim()
    if (MDC_COMPONENT_START_REGEX.test(line)) {
      stack.push(i)
    } else if (MDC_COMPONENT_END_REGEX.test(line)) {
      stack.pop()
    }
  }
  const componentStart = stack[stack.length - 1] ?? 0

  for (let i = componentStart; i < lineNumber; i++) {
    const match = document.lineAt(i).text.match(SLOT_PATTERN)
    if (match) {
      existing.add(match[1])
    }
  }

  return existing
}

/**
 * Scans the entire document for all slot names used inside instances of a given component.
 *
 * @param {vscode.TextDocument} document - The VS Code text document
 * @param {string} componentName - The MDC component name to search for
 * @returns {string[]} - Array of discovered slot names
 */
export function discoverSlotsFromDocument (document: vscode.TextDocument, componentName: string): string[] {
  const discoveredSlots = new Set<string>()
  const componentStack: string[] = []

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i).text.trim()
    if (!line) {
      continue
    }

    const startMatch = line.match(MDC_COMPONENT_START_REGEX)
    if (startMatch) {
      componentStack.push(startMatch[1])
      continue
    }

    if (MDC_COMPONENT_END_REGEX.test(line)) {
      componentStack.pop()
      continue
    }

    // If we're inside the target component, collect slot names
    const currentComponent = componentStack[componentStack.length - 1]
    if (currentComponent === componentName) {
      const slotMatch = line.match(SLOT_PATTERN)
      if (slotMatch) {
        discoveredSlots.add(slotMatch[1])
      }
    }
  }

  return Array.from(discoveredSlots)
}

/**
 * Extracts slots from a component file based on its extension.
 *
 * @param {string} text - The file content
 * @param {string} ext - The file extension (without dot)
 * @returns {string[]} - Array of slot names found
 */
function extractSlotsForExtension (text: string, ext: string): string[] {
  switch (ext) {
    case 'vue':
      return extractSlotsFromVue(text)
    case 'svelte':
      return extractSlotsFromSvelte(text)
    case 'tsx':
    case 'jsx':
      return extractSlotsFromReact(text)
    case 'ts':
    case 'html':
      return extractSlotsFromAngular(text)
    default:
      return []
  }
}

/**
 * Finds component source files (.vue, .svelte, .tsx, .jsx, .component.ts, .component.html)
 * matching the given component name and extracts slot names.
 * Results are cached with a TTL to avoid repeated file system lookups.
 *
 * @param {string} componentName - The component name to search for
 * @param {vscode.CancellationToken} [token] - Optional cancellation token
 * @returns {Promise<string[]>} - Array of discovered slot names
 */
async function discoverSlotsFromComponentFile (componentName: string, token?: vscode.CancellationToken): Promise<string[]> {
  // Check cache first
  const cached = componentFileSlotCache.get(componentName)
  if (cached && (Date.now() - cached.timestamp) < SLOT_CACHE_TTL_MS) {
    return cached.slots
  }

  try {
    if (token?.isCancellationRequested) {
      return []
    }

    const pascal = pascalCase(componentName)
    const workspaceFolders = vscode.workspace.workspaceFolders
    if (!workspaceFolders?.length) {
      return []
    }

    const pattern = `**/{${pascal},${componentName}}.{vue,svelte,tsx,jsx,component.ts,component.html}`
    const excludePattern = '{**/node_modules/**,**/dist/**,**/.output/**,**/.nuxt/**}'
    const files = await vscode.workspace.findFiles(pattern, excludePattern, 10)

    if (token?.isCancellationRequested) {
      return []
    }

    if (!files.length) {
      logger(`No component file found for: ${componentName}`)
      componentFileSlotCache.set(componentName, {
        slots: [],
        timestamp: Date.now()
      })
      return []
    }

    for (const file of files) {
      if (token?.isCancellationRequested) {
        return []
      }

      try {
        const content = await vscode.workspace.fs.readFile(file)
        const text = new TextDecoder().decode(content)
        const ext = file.fsPath.split('.').pop()?.toLowerCase() ?? ''

        const slots = extractSlotsForExtension(text, ext)

        if (slots.length > 0) {
          logger(`Found ${slots.length} slots in ${file.fsPath}: ${slots.join(', ')}`)
          componentFileSlotCache.set(componentName, {
            slots,
            timestamp: Date.now(),
          })
          return slots
        }
      } catch {
        continue
      }
    }

    componentFileSlotCache.set(componentName, {
      slots: [],
      timestamp: Date.now(),
    })
    return []
  } catch (error: any) {
    logger(`Error searching for component: ${error.message}`, 'error')
    return []
  }
}

/**
 * Discovers slots from all available sources:
 * 1. The current document (slot patterns)
 * 2. Other open documents
 * 3. Component source files in the workspace (Vue, Svelte, React, Angular)
 *
 * @param {vscode.TextDocument} currentDocument - The active document
 * @param {string} componentName - The MDC component name to discover slots for
 * @param {vscode.CancellationToken} [token] - Optional cancellation token
 * @returns {Promise<string[]>} - Array of discovered slot names
 */
async function discoverSlots (currentDocument: vscode.TextDocument, componentName: string, token?: vscode.CancellationToken): Promise<string[]> {
  const discoveredSlots = new Set<string>()

  // 1. Scan the current document
  const currentDocSlots = discoverSlotsFromDocument(currentDocument, componentName)
  for (const slot of currentDocSlots) {
    discoveredSlots.add(slot)
  }

  if (token?.isCancellationRequested) {
    return Array.from(discoveredSlots)
  }

  // 2. Scan other open documents
  const documents = vscode.workspace.textDocuments.filter(
    doc => doc !== currentDocument && (doc.languageId === 'mdc' || doc.fileName.endsWith('.md') || doc.fileName.endsWith('.mdc'))
  )
  for (const doc of documents) {
    const slots = discoverSlotsFromDocument(doc, componentName)
    for (const slot of slots) {
      discoveredSlots.add(slot)
    }
  }

  if (token?.isCancellationRequested) {
    return Array.from(discoveredSlots)
  }

  // 3. Scan component source files in the workspace (Vue, Svelte, React, Angular)
  const componentSlots = await discoverSlotsFromComponentFile(componentName, token)
  for (const slot of componentSlots) {
    discoveredSlots.add(slot)
  }

  logger(`Discovered slots for ::${componentName}: [${Array.from(discoveredSlots).join(', ')}]`)
  return Array.from(discoveredSlots)
}

/**
 * Creates a CompletionItemProvider for slot names inside block components.
 *
 * When metadata is available, suggests slots from component metadata.
 * When no metadata is available, discovers slots from usages of the
 * same component across the workspace and always suggests `#default`.
 *
 * @param {MDCComponentData[]} [componentData] - Optional array of component metadata
 * @returns {vscode.CompletionItemProvider} - The slot completion item provider
 */
export function getMdcSlotCompletionProvider (componentData?: MDCComponentData[]): vscode.CompletionItemProvider {
  return {
    async provideCompletionItems (document, position, token): Promise<vscode.CompletionItem[] | undefined> {
      const lineText = document.lineAt(position.line).text
      const textUntilCursor = lineText.slice(0, position.character)

      // Only trigger when typing `#` or `#partial-name` at line start (with optional whitespace)
      if (!/^\s*#[\w-]*$/.test(textUntilCursor)) {
        return undefined
      }

      // Don't suggest inside YAML blocks or code blocks
      if (isInsideYAMLBlock(document, position.line) || isInsideCodeBlock(document, position.line)) {
        return undefined
      }

      // Must be inside a block component
      const componentName = getEnclosingComponent(document, position.line)
      if (!componentName) {
        return undefined
      }

      if (token.isCancellationRequested) {
        return undefined
      }

      logger(`Slot completion triggered for ::${componentName} at line ${position.line}`)

      // Try to get slot names from metadata first
      const component = componentData?.find(c =>
        c.mdc_name === componentName || kebabCase(c.mdc_name) === kebabCase(componentName)
      )

      let slotNames: string[]
      const metaSlots = component?.component_meta?.meta?.slots

      if (metaSlots && metaSlots.length > 0) {
        slotNames = metaSlots.map(s => s.name)
        logger(`Using metadata slots: [${slotNames.join(', ')}]`)
      } else {
        // No metadata — discover slots from documents and component source files
        slotNames = await discoverSlots(document, componentName, token)
      }

      if (token.isCancellationRequested) {
        return undefined
      }
      if (slotNames.length === 0) {
        return undefined
      }

      // Filter out slots that are already used in the current component scope
      const existingSlots = getExistingSlotNames(document, position.line)
      const wordRange = document.getWordRangeAtPosition(position, /#[\w-]*/)

      // Expand range to include the `#` prefix so it gets replaced
      const replaceRange = wordRange
        ? new vscode.Range(wordRange.start, wordRange.end)
        : new vscode.Range(position.line, position.character - 1, position.line, position.character)

      const items: vscode.CompletionItem[] = []
      const displayComponentName = component?.mdc_name ?? componentName

      for (const slotName of slotNames) {
        if (existingSlots.has(slotName)) {
          continue
        }

        const item = new vscode.CompletionItem(`#${slotName}`, vscode.CompletionItemKind.Field)
        item.range = replaceRange
        item.insertText = new vscode.SnippetString(`#${slotName}\n\${0}`)
        item.detail = `Slot: ${slotName}`
        item.documentation = new vscode.MarkdownString(
          `Insert the \`#${slotName}\` slot for \`::${displayComponentName}\``
        )
        item.sortText = slotName === 'default' ? '0' : `1_${slotName}`

        items.push(item)
      }

      return items
    }
  }
}
