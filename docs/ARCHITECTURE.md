# Arquitetura Técnica

## Stack e Tecnologias
- **Framework Core**: Nuxt 3 (SSR desabilitado para o editor usando `MonacoEditor.client.vue`).
- **Estilização**: Tailwind CSS.
- **Editor de Código**: Monaco Editor integrado (via pacote e hooks customizados) rodando no Client.
- **Exportação Gráfica**: `html-to-image` responsável pela conversão do DOM do Preview em arquivo PNG.

## Fluxo de Dados

A arquitetura do Iceberg as Code adota um fluxo unidirecional e fortemente reativo suportado pela *Composition API* do Vue:

1. **Input**: O usuário digita no Monaco Editor.
2. **Parsing**: O composable `useIceberg` reativamente passa o código para a função `IcebergParser()`.
3. **AST**: A função retorna uma *Abstract Syntax Tree* simplificada (o tipo `IcebergResult`), contendo um array validado de *Tiers* (níveis).
4. **Renderização**: O Vue reativamente monta `TierBlock.vue` no painel direito, mapeando os dados da AST para os nós DOM com base nas zonas cadastradas em `zones.ts`.
5. **Persistência**: Um *watcher* em `useIceberg` salva silenciosamente o texto do Monaco no `localStorage` após 500ms de inatividade (Debounce).

## Estrutura de Diretórios (`app/`)
```
app/
├── components/
│   ├── editor/         # Configuração e Status Bar do Monaco
│   ├── layout/         # Header superior, Split Pane e Toolbar principal
│   └── preview/        # Painel direito (View do Iceberg, Tier Blocks, Footer)
├── composables/
│   └── useIceberg.ts   # Estado global reativo (Código, Fonte, Toggles, Persistência)
├── lib/
│   └── iceberg/
│       ├── monarch.ts  # Analisador léxico que pinta a sintaxe dentro do Monaco
│       ├── parser.ts   # O compilador da sintaxe customizada
│       ├── types.ts    # Tipagens TypeScript principais
│       └── zones.ts    # Dicionário de profundidades e cores
└── app.vue             # O "Shell" raiz que posiciona o layout
```

## Destaques de Implementação
- O Monaco usa a API `monaco.languages.setMonarchTokensProvider` para entender os tokens de uma linguagem totalmente customizada e colorir as chaves `tier` e strings em tempo real.
- Todo processamento de AST e DOM Capture via canvas (`html-to-image`) é mantido estritamente no *Client-Side* para evitar erros de hidratação ou falta de APIs de browser no backend.
