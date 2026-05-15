# Infrastructure

Implementações concretas das interfaces definidas em `domain/repositories` e `application/ports`. Aqui ficam os "detalhes técnicos".

Projeto **100% offline-first** — não há backend, não há API HTTP. Persistência local apenas.

## Subpastas

- `persistence/` — SQLite (expo-sqlite). Implementações de `TaskRepository`, `UserRepository`, etc.
- `notifications/` — `expo-notifications`. Implementação de `NotificationPort`.
- `platform/` — APIs específicas de SO (bloqueio de apps no Android via `UsageStatsManager`).

## Regras

1. Esta camada é a única que pode importar libs nativas/externas.
2. Implementa as interfaces de domínio/aplicação — nunca cria as próprias.
3. Não exporta classes diretamente para `presentation/` — apenas via injeção de dependência.
