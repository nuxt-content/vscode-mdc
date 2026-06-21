import { kebabCase } from 'scule'

/**
 * Extracts slot names from a Vue SFC (.vue) by looking for:
 * - defineSlots<{ slotName(): any }>()
 * - <slot name="slotName" />
 */
export function extractSlotsFromVue (content: string): string[] {
  const slots = new Set<string>()

  // defineSlots<{ name(): any }>
  const defineSlotsMatch = content.match(/defineSlots\s*<\s*\{([^}]*)\}\s*>/s)
  if (defineSlotsMatch) {
    const body = defineSlotsMatch[1]
    const re = /(\w+)\s*\(/g
    let m
    while ((m = re.exec(body)) !== null) {
      slots.add(m[1])
    }
  }

  // <slot name="xxx">
  const slotTagRe = /<slot\s+(?:[^>]*\s)?name="([\w-]+)"/g
  let m
  while ((m = slotTagRe.exec(content)) !== null) {
    slots.add(m[1])
  }

  return Array.from(slots)
}

/**
 * Extracts slot names from a Svelte component (.svelte) by looking for:
 * - <slot name="slotName" />
 * - <slot /> (default)
 * - {#snippet slotName()} (Svelte 5 snippets)
 */
export function extractSlotsFromSvelte (content: string): string[] {
  const slots = new Set<string>()

  // <slot name="xxx">
  const namedSlotRe = /<slot\s+(?:[^>]*\s)?name="([\w-]+)"/g
  let m
  while ((m = namedSlotRe.exec(content)) !== null) {
    slots.add(m[1])
  }

  // <slot /> or <slot> (no name attr = default)
  const defaultSlotRe = /<slot\s*\/?>/g
  if (defaultSlotRe.test(content)) {
    slots.add('default')
  }

  // Svelte 5 snippet props: {#snippet slotName()}
  const snippetRe = /\{#snippet\s+(\w+)\s*\(/g
  while ((m = snippetRe.exec(content)) !== null) {
    slots.add(m[1])
  }

  return Array.from(slots)
}

/**
 * Extracts slot names from a React/TSX component (.tsx/.jsx) by looking for:
 * - Props interface/type with ReactNode/React.ReactNode typed properties
 * - `props.children` usage (maps to default slot)
 */
export function extractSlotsFromReact (content: string): string[] {
  const slots = new Set<string>()

  // Match properties typed as ReactNode in interfaces/types
  // e.g. header?: ReactNode, footer: React.ReactNode
  const reactNodeRe = /^\s*(\w+)\s*[?]?\s*:\s*(?:React\.)?ReactNode/gm
  let m
  while ((m = reactNodeRe.exec(content)) !== null) {
    const name = m[1]
    if (name === 'children') {
      slots.add('default')
    } else {
      slots.add(kebabCase(name))
    }
  }

  // Check for props.children usage
  if (/props\.children|\{\s*children\s*\}/.test(content)) {
    slots.add('default')
  }

  return Array.from(slots)
}

/**
 * Extracts slot names from an Angular component (.ts with inline template or .html) by looking for:
 * - `<ng-content select="[slotName]" />` (attribute selector → slot name)
 * - `<ng-content select=".slotName" />` (class selector → slot name)
 * - `<ng-content />` or `<ng-content>` (no select → default slot)
 */
export function extractSlotsFromAngular (content: string): string[] {
  const slots = new Set<string>()

  // <ng-content select="[slotName]"> — attribute selector
  const attrSelectRe = /<ng-content\s+[^>]*select="[^"]*\[(\w[\w-]*)\][^"]*"/g
  let m
  while ((m = attrSelectRe.exec(content)) !== null) {
    slots.add(kebabCase(m[1]))
  }

  // <ng-content select=".slotName"> — class selector
  const classSelectRe = /<ng-content\s+[^>]*select="[^"]*\.([\w-]+)[^"]*"/g
  while ((m = classSelectRe.exec(content)) !== null) {
    slots.add(kebabCase(m[1]))
  }

  // <ng-content> or <ng-content /> with no select attribute — default slot
  const defaultRe = /<ng-content\s*\/?>/g
  if (defaultRe.test(content)) {
    slots.add('default')
  }

  return Array.from(slots)
}
