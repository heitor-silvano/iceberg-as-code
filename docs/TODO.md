# Todo & Roadmap

Este documento centraliza as tarefas pendentes, bugs conhecidos e melhorias contínuas.
Qualquer agente de Inteligência Artificial ou Desenvolvedor deve consultar este arquivo para saber em que ponto do desenvolvimento o projeto se encontra.

## 🟢 Em Andamento
- (Nenhuma tarefa bloqueante no momento).

## 📅 Próximas Tarefas Aprovadas
- [x] **Integração do SVG Oficial do Iceberg**:
  - Receber o ativo gráfico do Iceberg em vetor.
  - Substituir a cor sólida de fundo (`#bfe3f7`) do `PreviewPanel.vue` pelo background escalável contendo o Iceberg real, assegurando que os blocos de Tiers alinhem corretamente com a montanha de gelo na imagem.
- [ ] **Botão Templates**:
  - Criar um Modal ou Dropdown que carregue exemplos de gelos (Icebergs) pré-escritos, alterando o estado `code` no `useIceberg`.
- [ ] **Otimização do ExportToPNG**:
  - Garantir suporte em telas Retina (DPI altíssimo) gerando um PNG sem serrilhados (escala no `html-to-image`).

## 🐞 Bugs / Dívida Técnica
- Quando nomes de níveis são extremamente grandes, o texto pode quebrar para a linha de baixo dependendo do tamanho da tela. Adicionar classe de `.truncate` ou flex-wrap com limites adequados.

## ✅ Tarefas Concluídas Recentes
- [x] Construção do Shell do app com `SplitPane.vue` drag-and-drop.
- [x] Remoção de metrificações complexas e informações desnecessárias a pedido do usuário, limpando a visualização.
- [x] Remoção da tipografia 'Impact' da toolbar.
- [x] Refatoração do `parser.ts` para tolerar entradas e gerar relatórios de validação no Monaco Editor.
