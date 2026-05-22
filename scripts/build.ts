import fs from 'fs'
import { grammar } from '../src/grammar'

const $schema = 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json'

console.log('Start build')

fs.writeFileSync('syntaxes/mdc.tmLanguage.json', JSON.stringify({
  $schema,
  name: grammar.name,
  aliases: ['comark'],
  ...grammar
}, null, 2) + '\n', 'utf-8')

console.log('Write syntaxes/mdc.tmLanguage.json')

const standalone = {
  $schema,
  name: grammar.name,
  aliases: ['comark'],
  displayName: 'MDC - Components in Markdown',
  injectionSelector: grammar.injectionSelector,
  scopeName: 'text.markdown.mdc.standalone',
  patterns: [
    { include: 'text.html.markdown#frontMatter' },
    { include: '#block' }
  ],
  repository: {
    ...grammar.repository,
    block: {
      patterns: [
        { include: '#inline' },
        ...(grammar.repository.block.patterns ?? [])
      ]
    }
  }
}

fs.writeFileSync('syntaxes/mdc.standalone.tmLanguage.json', JSON.stringify(standalone, null, 2) + '\n', 'utf-8')

console.log('Write syntaxes/mdc.standalone.tmLanguage.json')
