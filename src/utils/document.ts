import * as vscode from 'vscode'

/**
 * Determines if the current position is inside a YAML block (between `---` delimiters).
 *
 * @param {vscode.TextDocument} document - The VS Code text document
 * @param {number} lineNumber - The 0-based line number of the current cursor position
 * @returns {boolean} - True if inside a YAML block, false otherwise
 */
export function isInsideYAMLBlock (document: vscode.TextDocument, lineNumber: number): boolean {
  let inside = false
  for (let i = 0; i < lineNumber; i++) {
    const line = document.lineAt(i).text.trim()
    if (/^\s*---\s*$/.test(line)) {
      inside = !inside
    }
  }
  return inside
}

/**
 * Determines if the current position is inside a fenced code block.
 *
 * @param {vscode.TextDocument} document - The VS Code text document
 * @param {number} lineNumber - The 0-based line number of the current cursor position
 * @returns {boolean} - True if inside a code block, false otherwise
 */
export function isInsideCodeBlock (document: vscode.TextDocument, lineNumber: number): boolean {
  let inside = false
  for (let i = 0; i < lineNumber; i++) {
    if (/^\s*(?:`{3,}|~{3,})/.test(document.lineAt(i).text.trim())) {
      inside = !inside
    }
  }
  return inside
}
