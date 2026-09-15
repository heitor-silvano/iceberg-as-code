# Instruções para Agentes de IA (AGENTS.md)

Este documento define regras obrigatórias para qualquer agente de Inteligência Artificial trabalhando neste repositório.

## 🧪 Obrigatoriedade de Testes
1. **Testes para Novas Features**: É **estritamente obrigatório** aplicar testes automatizados para qualquer nova feature ou funcionalidade adicionada ao projeto.
2. **Correção Imediata em Caso de Falha**: Caso qualquer teste falhe, ele **deve ser corrigido imediatamente** antes de considerar a tarefa finalizada.
3. **Execução de Verificação**: Antes de concluir qualquer alteração, execute a suíte de testes (`npm test`) e garanta que todos os testes passem com 100% de sucesso.

## 📐 Diretrizes de Codificação e Arquitetura
1. **Spec-Driven Development**: Antes de alterar fluxos ou regras da linguagem, consulte `docs/SPEC.md`, `docs/ARCHITECTURE.md` e `docs/TODO.md`.
2. **PROIBIÇÃO DE COMENTÁRIOS NO CÓDIGO**: É ESTRITAMENTE PROIBIDO adicionar comentários (`//`, `/* */`, `<!-- -->`) em qualquer arquivo de código (`.vue`, `.ts`, `.js`). O código deve ser totalmente autoexplicativo.
3. **Integridade do Parser e Reatividade**: Qualquer alteração no parser (`app/lib/iceberg/parser.ts`) ou composables (`app/composables/useIceberg.ts`) deve manter total compatibilidade com a sintaxe existente e preservar a reatividade sem perda de dados digitados pelo usuário.
4. **Comunicação Direta**: Seja conciso nas respostas ao desenvolvedor, apontando arquivos alterados e status de testes.
