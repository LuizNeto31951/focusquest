# Application

Casos de uso — orquestram entidades de domínio + interfaces de infraestrutura.

## Subpastas

- `use-cases/` — uma classe/função por caso de uso (ex.: `CreateTaskUseCase`, `CompleteTaskUseCase`, `StartFocusSessionUseCase`).
- `ports/` — interfaces de saída (output ports) específicas da aplicação que não cabem em `domain/repositories` (ex.: `NotificationPort`, `AppBlockerPort`).

## Regras

1. Cada use case recebe suas dependências via construtor (DIP) — injetadas pela camada `infrastructure` no composition root.
2. Use cases não devem conhecer React. São funções/classes puras de TypeScript.
3. Hooks de presentation chamam use cases — não o contrário.
