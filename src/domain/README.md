# Domain

Regras de negócio puras do FocusQuest. **Sem dependências externas** (sem React, sem React Native, sem SQLite, sem fetch).

## Subpastas

- `entities/` — modelos de negócio (Task, User, Achievement, FocusSession).
- `value-objects/` — tipos imutáveis com regras (XP, Priority, Level).
- `repositories/` — interfaces (abstrações) dos repositórios. Implementações ficam em `infrastructure/`.
- `services/` — serviços de domínio (regras que envolvem múltiplas entidades, ex.: calcular XP, decidir level up).

## Regras

1. Nunca importe de `presentation/` ou `infrastructure/`.
2. Toda função aqui deve ser **testável sem mock**.
3. Use `Result<T, E>` para erros previsíveis em vez de exceções (em `shared/errors`).
