# Instruções de IA (Contexto e Regras)

Este arquivo define como **qualquer assistente de Inteligência Artificial** (ex: Cursor, Cline, Aider, Antigravity) deve interagir com este repositório de código e ler a documentação.

## Diretrizes de Codificação
1. **Spec-Driven Development**: Antes de sugerir refatorações, mudar um fluxo ou alterar lógicas vitais, a IA **DEVE LER** `docs/SPEC.md` e `docs/ARCHITECTURE.md` para garantir que compreendeu os requisitos atuais.
2. **Atualização da Fonte de Verdade**: Se o desenvolvedor (humano) pedir uma nova funcionalidade (ex: "adicione suporte a imagens nos Tiers"), a IA deve atualizar primeiramente o `SPEC.md`, atualizar o `TODO.md` e só depois prosseguir com o código.
3. **PROIBIÇÃO DE COMENTÁRIOS NO CÓDIGO**: É ESTRITAMENTE PROIBIDO adicionar comentários (`//`, `/* */`, `<!-- -->`) em qualquer arquivo de código do projeto (`.vue`, `.ts`, etc). O código deve ser totalmente autoexplicativo. NENHUM comentário é permitido.
4. **Respeite o Parser Existente**: Qualquer mudança em `app/lib/iceberg/parser.ts` não deve quebrar a sintaxe existente definida na gramática. Testes regressivos ou scripts simples (`scratch/test-parser.ts`) devem ser criados e executados antes de afirmar que o parser funciona.
5. **Obrigatoriedade de Testes**: É OBRIGATÓRIO aplicar testes automatizados para qualquer nova feature. Caso testes falhem, eles DEVEM ser corrigidos antes de finalizar a tarefa. Sempre execute `npm test` para validar.
6. **Comunicação Concisa**: Não sumarize códigos ou a documentação inteira para o humano. Apenas aponte os documentos atualizados e solicite aprovação/caminho a seguir.

## Links para Leitura Imediata
Seja bem-vinda, IA! Por favor, leia agora:
- `docs/SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/TODO.md`
