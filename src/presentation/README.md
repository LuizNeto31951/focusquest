# Presentation

Camada de UI: telas, componentes, navegação, tema e hooks.

## Padrão de organização: MVVM

Toda **tela** e todo **componente reutilizável** segue o mesmo padrão:

```
Nome/
├── Nome.tsx           # View — apenas JSX, sem lógica de negócio
├── Nome.styles.ts     # StyleSheet — função createStyles(theme)
├── Nome.types.ts      # Tipos/props
├── useNome.ts         # ViewModel — hook com toda lógica, estado, side effects (em telas e componentes complexos)
└── index.ts           # Barrel export
```

**Regras:**
- A View nunca acessa `application/` ou `infrastructure/` diretamente — sempre via hook (ViewModel).
- Estilos nunca usam números mágicos — sempre `theme.spacing.*`, `theme.colors.*`, etc.
- Componentes pequenos (botão, ícone) podem não ter `useNome.ts` se forem 100% apresentacionais.

## Subpastas

- `theme/` — design tokens (cores, espaçamento, tipografia, customização).
- `providers/` — providers de Context (Theme, futuramente DI).
- `components/` — componentes reutilizáveis em qualquer tela.
- `screens/` — telas completas do app.
- `navigation/` — configuração do React Navigation.
- `hooks/` — hooks globais reutilizáveis.
