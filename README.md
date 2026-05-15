# FocusQuest

Aplicativo de gerenciamento de rotina gamificado para pessoas com TDAH.
TCC — Bacharelado em Sistemas de Informação, IFBA Campus Vitória da Conquista.

## Stack

- **Expo SDK 54** + **React Native 0.81**
- **TypeScript** estrito
- **Offline-first** (sem backend) — persistência via SQLite local

## Arquitetura

Clean Architecture em 4 camadas, mais um módulo transversal:

```
src/
├── domain/            # Regras de negócio puras (sem dependências externas)
├── application/       # Casos de uso (orquestração)
├── infrastructure/    # Implementações: SQLite, notificações, APIs nativas
├── presentation/      # UI: telas, componentes, tema, navegação
└── shared/            # Tipos, utils, erros transversais
```

Cada camada tem um `README.md` com regras específicas. Em resumo:

| Camada | Pode importar de | Não pode importar de |
|---|---|---|
| domain | shared | application, infrastructure, presentation |
| application | domain, shared | infrastructure, presentation |
| infrastructure | domain, application, shared | presentation |
| presentation | application, domain, shared, infrastructure (apenas no composition root) | — |

### Padrão MVVM nas telas

Cada tela em `presentation/screens/Nome/` tem:

- `Nome.tsx` — **View** (JSX puro)
- `Nome.styles.ts` — **estilos** (StyleSheet via factory que recebe theme)
- `useNome.ts` — **ViewModel** (hook com lógica, estado, side effects)
- `Nome.types.ts` — tipos/props
- `index.ts` — barrel export

## Customização (regras TDAH)

O usuário pode ajustar:

- Modo claro/escuro
- Cor de destaque (7 presets acessíveis)
- Escala de fonte (0.875× a 1.25×)
- Densidade (compact/normal/comfortable)
- Reduzir animações

Tudo aplicado dinamicamente via `ThemeProvider` (`src/presentation/providers/ThemeProvider.tsx`).

## Scripts

```bash
npm start         # Inicia Metro bundler + QR code para Expo Go
npm run android   # Abre no emulador/dispositivo Android
npm run web       # Abre versão web (útil para protótipo rápido)
```

## Path aliases

Imports usam `@/...`:

```ts
import { Button } from '@/presentation/components';
import type { Task } from '@/domain/entities/Task';
```

Configurado em `tsconfig.json` (compile-time) e `metro.config.js` (runtime).
