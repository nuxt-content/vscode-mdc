/**
 * Minimal vscode module stub used by vitest unit tests.
 * Only the symbols that are actually referenced at import-time need to exist.
 */
export const CompletionItemKind = { Field: 5 }
export const CompletionItem = class {}
export const SnippetString = class { constructor (public value: string) {} }
export const MarkdownString = class { constructor (public value: string) {} }
export const Range = class {
  constructor (
    public startLine: number,
    public startChar: number,
    public endLine: number,
    public endChar: number
  ) {}
}
export const workspace = {
  workspaceFolders: [],
  textDocuments: [],
  getConfiguration: () => ({ get: () => undefined }),
  findFiles: async () => [],
  fs: { readFile: async () => new Uint8Array() }
}
export const window = {
  showInformationMessage: () => {},
  showErrorMessage: () => {}
}
