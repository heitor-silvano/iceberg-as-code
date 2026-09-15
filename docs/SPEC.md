# Especificação do Produto (Product Spec)

## Visão Geral
**Iceberg as Code** é uma aplicação web que permite aos usuários gerar imagens no formato do clássico meme "Iceberg" utilizando apenas texto (código) estruturado. A ferramenta provê um editor de texto interativo com validação em tempo real e um preview reativo que desenha as camadas do iceberg baseado na sintaxe.

## Especificação da Linguagem (`iceberg`)

A aplicação utiliza um parser próprio focado em simplicidade.

### Regras da Gramática
1. **Configuração Global**: `max_random_offset = <numero>`. Usado para ditar a variação de deslocamento aleatório das entradas na camada.
2. **Níveis (Tiers)**: Um nível é declarado usando a sintaxe `tier "Nome do Nível"`. 
   - Exemplo: `tier "The Tip"` ou `tier "Deep Waters"`.
3. **Entradas (Items)**: Pertencem ao último nível declarado e devem ser identadas com exatos 2 ou mais espaços (ou uma tabulação).
   - Exemplo: `  Item 1`
4. **Comentários**: Linhas começando com `//` são ignoradas.
5. **Linhas Vazias**: Ignoradas durante a renderização.

**Exemplo Completo:**
```iceberg
max_random_offset = 10

tier "Superfície"
  Google
  Youtube

tier "Águas Rasas"
  Reddit
  4chan
```

## Zonas Oceânicas e Cores

O Iceberg é dividido em zonas com base no índice (0-indexado) do nível declarado. 
*Nota: O primeiro tier (índice 0) é a ponta, logo, não mostra profundidade na UI.*

| Índice | Título Oculto/Secundário | Profundidade | Cor (Pill) |
| :--- | :--- | :--- | :--- |
| `0` | THE SURFACE | *(Oculto)* | `#06b6d4` (Ciano) |
| `1` | SHALLOW WATERS | `-200m (Sunlit)` | `#0ea5e9` (Azul Claro) |
| `2` | TWILIGHT ZONE | `-1,000m (Twilight)` | `#3b82f6` (Azul) |
| `3` | MIDNIGHT ZONE | `-4,000m (Midnight)` | `#6366f1` (Índigo) |
| `4` | THE ABYSS | `-6,000m (Abyssal)` | `#8b5cf6` (Violeta) |
| `5` | THE TRENCH | `-11,000m (Hadal)` | `#ec4899` (Rosa) |
| `6+` | THE VOID | `> -11,000m` | `#ef4444` (Vermelho) |

## Comportamento da Interface de Usuário (UI)

1. **Split Pane**: Editor e Preview dividem a tela 50/50 por padrão. Um divisor arrastável permite redimensionar o painel entre 20% e 80% da tela.
2. **Preview Reativo**: As alterações no código refletem imediatamente no preview. Erros de parsing não quebram o visualizador.
3. **Tipografia do Preview**: O usuário pode alternar a fonte dos itens renderizados entre `Sans` e `Mono`.
4. **Exportação**: O usuário pode clicar em "Export" na barra superior para baixar um arquivo PNG em alta resolução do resultado gerado.
5. **Persistência**: Alterações não salvas (rascunhos) persistem no `localStorage` do navegador.
