import type * as monaco from 'monaco-editor'

export const ICEBERG_LANGUAGE_ID = 'iceberg'
export const ICEBERG_THEME_ID = 'iceberg-dark'

export const icebergLanguageDefinition: monaco.languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.iceberg',
  
  keywords: ['tier', 'max_random_offset'],

  tokenizer: {
    root: [

      [/\/\/.*$/, 'comment'],

      [/max_random_offset\b/, 'keyword.config'],
      [/[0-9]+(\.[0-9]+)?/, 'number'],
      [/=/, 'operator'],

      [/tier\s+"([^"\\]|\\.)*"/, 'string.tier-title'],
      [/tier\b/, 'keyword.tier'],
      [/"([^"\\]|\\.)*"/, 'string'],

      [/^(\s{2,}|\t)[^\n\r]+/, 'type.item'],

      [/[{}()\[\]]/, '@brackets'],
    ],
  },
}

export const icebergThemeDefinition: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '71717a', fontStyle: 'italic' },
    { token: 'keyword.config', foreground: 'a78bfa', fontStyle: 'bold' },
    { token: 'number', foreground: 'fbbf24' },
    { token: 'keyword.tier', foreground: '38bdf8', fontStyle: 'bold' },
    { token: 'string.tier-title', foreground: '67e8f9', fontStyle: 'bold' },
    { token: 'string', foreground: 'a5f3fc' },
    { token: 'type.item', foreground: 'f4f4f5' },
    { token: 'operator', foreground: '94a3b8' },
  ],
  colors: {
    'editor.background': '#18181b',
    'editor.foreground': '#f4f4f5',
    'editorLineNumber.foreground': '#52525b',
    'editorLineNumber.activeForeground': '#a1a1aa',
    'editor.lineHighlightBackground': '#27272a55',
    'editorCursor.foreground': '#38bdf8',
    'editor.selectionBackground': '#38bdf833',
    'editor.inactiveSelectionBackground': '#27272a88',
  },
}
