# FocusQuest

App de gerenciamento de rotina **gamificado** para pessoas com TDAH. TCC — Bacharelado em Sistemas de Informação, IFBA Vitória da Conquista.

---

## 1. O que é e por quê

O FocusQuest combina três coisas em um único app:

- **Gestão de tarefas** com categorias, prioridades, prazos, subtarefas e recorrência.
- **Modo foco** tipo Pomodoro com bloqueio nativo de aplicativos distratores no Android.
- **Gamificação** — XP, níveis, moedas, conquistas e uma "lojinha" de recompensas pessoais cadastradas pelo usuário.

O recorte para o público com TDAH motiva três decisões centrais:

1. **Bloqueio real de apps**, não só cronômetro. Pessoas com TDAH têm dificuldade documentada de função executiva (iniciar tarefas, resistir a distrações); uma barreira sistêmica funciona melhor que uma sugestão.
2. **Gamificação explícita** como reforço motivacional. O circuito dopaminérgico atípico do TDAH responde mal a recompensas distantes; XP, moedas e conquistas oferecem feedback imediato.
3. **Customização sensorial ampla** (cores, fontes, densidades, animações). O público é heterogêneo em tolerância sensorial — em vez de impor um único design, deixamos cada usuário ajustar.

E uma quarta decisão transversal: **100% offline, sem cadastro**. Não há servidor, login ou conta — o primeiro toque cria um usuário local. Motivação dupla: fricção de cadastro é gatilho conhecido de evasão para esse público, e simplifica o escopo do TCC ao eliminar backend.

---

## 2. Funcionalidades

**Tarefas** — título, descrição, categoria (6 padrão + customizáveis), prioridade (baixa/média/alta), duração estimada, prazo opcional, horário agendado opcional. Subtarefas (a pai só fecha quando todas as filhas fecharem). Recorrência diária, semanal por dias da semana, ou a cada N dias. Notificação local agendada para o horário marcado.

**Modo foco** — duração de 15/25/45/60 min, opcionalmente vinculado a uma tarefa. Seleção prévia de apps a bloquear (com lista de instalados, mostrando ícones). Notificação persistente "Modo foco ativo" com ação rápida "Encerrar foco". Quando o usuário abre um app bloqueado: detecção em ≤800ms, sobreposição em tela cheia, retorno automático à home. Sessão cumprida vale XP/moedas; interrompida não vale nada.

**Gamificação:**
- **XP** por tarefa concluída = base por prioridade (10/20/35) × `(1 + min/60)` × bônus pontualidade (+20%) × bônus streak (+5%/dia, teto 50%). Sessão de foco bem-sucedida = 15 XP fixos.
- **Níveis** com curva exponencial — 100 XP para nível 2, 400 para o 3, ~96 mil para o 11. Curva íngreme deliberada: rápido no início (engajamento), lento depois (longo prazo).
- **Moedas** em paralelo (1/3/5 por prioridade; 2 + 1 por bloco de 15min de foco), gastas na lojinha.
- **Streak** com função "pular dia" que preserva a sequência — concessão à realidade do TDAH onde dias ruins acontecem.
- **Conquistas** automáticas (9 padrão) + conquistas customizadas.
- **Lojinha** com recompensas cadastradas pelo próprio usuário (ex.: "assistir um episódio"). O sistema não decide o que é recompensa válida — o usuário define o que tem valor pra ele.

**Customização visual** — modo claro/escuro, 7 cores de destaque, 4 escalas de fonte (0.875× a 1.25×), 3 densidades de espaçamento, reduzir animações.

**Navegação** — 6 abas: Início, Tarefas, Foco, Lojinha, Conquistas, Perfil.

---

## 3. Stack tecnológica

| Camada | Tecnologia | Por quê |
|---|---|---|
| Runtime | React Native 0.81 + Expo SDK 54 (bare workflow) | Cross-platform com acesso a Kotlin nativo quando preciso |
| Linguagem | TypeScript estrito | Captura bugs em tempo de compilação; suporta branded types |
| Estado global | Zustand 5 | Meio-termo entre Redux (boilerplate) e Context (re-render desnecessário) |
| Navegação | React Navigation 7 (Bottom Tabs + Native Stack) | Padrão do ecossistema; transições nativas |
| Persistência | expo-sqlite (WAL + foreign keys) | Banco embarcado robusto; alinhado com o offline-first |
| Notificações | expo-notifications | Abstração unificada para canais Android e iOS |
| Animação | react-native-reanimated 4 | Roda em thread separada (worklets), não compete com JS |
| Build | EAS Build + expo-updates (OTA) | Compilação em nuvem; updates de JS sem passar pela Play Store |
| Módulo nativo | Kotlin via Expo Modules | Não há lib JS confiável para bloqueio de apps no Android moderno |

O **bare workflow** (com `android/` versionado) é necessário porque o módulo de bloqueio exige código Kotlin direto. **Sem suporte iOS** — o bloqueio no iOS exigiria Screen Time API com modelo de programação totalmente diferente, seria projeto autônomo.

---

## 4. Arquitetura — Clean Architecture em 4 camadas

```
src/
├── domain/            Regras de negócio puras (sem libs externas)
├── application/       Casos de uso (orquestração)
├── infrastructure/    SQLite, notificações, APIs nativas
├── presentation/      UI: telas, componentes, tema, navegação
└── shared/            Tipos e utilitários transversais
```

**Por que Clean Architecture:** separar o que muda lentamente (regras de gamificação, XP, streak) do que muda rapidamente (UI, banco, framework). Se um dia trocarmos SQLite por outro banco ou React Native por outra tecnologia, as regras de negócio ficam intactas. O custo é mais arquivos por feature; o ganho é longevidade do código central, importante para evolução em pesquisa.

**Regra de dependência:** cada camada só importa das camadas mais internas. O `domain` não conhece nada além de si mesmo. A `presentation` é a única que pode tocar a `infrastructure` — e mesmo assim só em um arquivo (o composition root onde se monta a injeção de dependências).

### Domain
Entidades imutáveis (`Task`, `User`, `FocusSession`, `Achievement`, `Reward`, etc.) com todos os campos `readonly`. Imutabilidade evita uma classe inteira de bugs em React e facilita raciocínio sobre o código.

Value objects com **branded types** (`XP`, `Level`, `DurationMinutes`, `UniqueId`, `ISODate`) — números/strings marcados invisivelmente para que o compilador detecte se você passa minutos onde se espera XP. Custo leve, ganho em evitar confusão entre grandezas.

Serviços puros: `XPCalculator`, `LevelCalculator`, `StreakCalculator`, `AchievementEvaluator`, `RecurrenceMatcher`. Funcionam sem React, sem SQLite, são testáveis isoladamente.

### Application
Cerca de 30 casos de uso, cada um uma classe com construtor injetando dependências e método `execute(input)` único. Agrupados por feature (`tasks/`, `focus/`, `gamification/`, `shop/`, `stats/`).

Quatro **ports** auxiliares (`Clock`, `IdGenerator`, `NotificationScheduler`, `AppBlocker`) são técnicos por natureza, então vivem aqui e não no domínio. Permitem mockar tempo, IDs, notificações em testes.

Exemplo paradigmático: `CompleteTaskUseCase` coordena 5 repositórios + 2 serviços + 1 sub-caso (avaliação de conquistas), retornando um output rico (`{ task, user, xpAwarded, coinsAwarded, breakdown, newlyUnlockedAchievements }`) que a UI consome para feedback visual.

### Infrastructure
- **SQLite** com `PRAGMA foreign_keys = ON` (SQLite não força por padrão) e `journal_mode = WAL` (melhor concorrência leitura/escrita).
- **Soft migrations**: lista de `ALTER TABLE` em try/catch. Simples, não-versionada; suficiente para o escopo do TCC.
- **Repositórios** usam `INSERT ... ON CONFLICT DO UPDATE` como upsert — a aplicação nunca precisa decidir entre create e update.
- **Mappers** convertem entre formato do banco (linhas planas) e entidades do domínio.
- **Seeds automáticos** de 6 categorias, 9 conquistas e 5 recompensas no primeiro boot. UUIDs fixos para reprodutibilidade.

### Presentation
**Padrão MVVM por pasta** — cada tela tem `Nome.tsx` (View JSX puro), `Nome.styles.ts` (factory que recebe theme), `useNome.ts` (ViewModel com toda lógica), `index.ts`. View nunca acessa application/infrastructure direto — sempre via hook. Mais arquivos por feature, mas cada um tem responsabilidade clara.

**Composition Root** em [buildAppDependencies.ts](src/presentation/composition/buildAppDependencies.ts) — único arquivo que importa simultaneamente application + infrastructure. Faz toda a injeção de dependências manualmente. Sem framework de DI (InversifyJS etc.) porque nesta escala não compensa.

**Estado global em Zustand**, seis stores pequenas:
- `userStore` — espelho do usuário corrente.
- `tasksStore` — filtros da lista.
- `focusStore` — sessão de foco ativa.
- `feedbackStore` — fila de eventos gamificados (XP toast, level up, conquistas). Componente `<GamificationFeedback>` no topo da árvore observa e renderiza — desacopla a tela que disparou a ação do feedback visual.
- `blockedAppsStore` — pacotes selecionados, **não persistido** (a cada sessão o usuário escolhe de novo — consentimento explícito).
- `invalidationStore` — versões inteiras incrementadas por mutações; hooks de query observam e refetcham automaticamente. "react-query do pobre" — cerca de 30 linhas, evita propagar `refetch` entre telas.

**Tema dinâmico** — função `buildTheme({ mode, preferences })` recompila o objeto completo quando preferências mudam. Estilos sempre via tokens (`theme.spacing.md`), nunca números mágicos.

---

## 5. Módulo nativo `app-blocker`

Escrito em Kotlin via Expo Modules, em [modules/app-blocker/](modules/app-blocker/). É o ponto mais complexo do projeto, justifica o uso de bare workflow.

**Três permissões necessárias**, todas concedidas manualmente pelo usuário em Configurações:
- `PACKAGE_USAGE_STATS` — detectar app em primeiro plano (não é runtime permission, é especial).
- `SYSTEM_ALERT_WINDOW` — sobrepor interface a outros apps.
- `FOREGROUND_SERVICE_SPECIAL_USE` — manter o processo vivo (Android 14+).

**Três classes Kotlin** colaboram:

- **`AppBlockerModule`** — fronteira Expo↔Kotlin. Expõe as funções async chamadas pelo JS. Exige permissões só se a lista de apps a bloquear for não-vazia (permite modo foco sem bloqueio, só com notificação).
- **`InstalledAppsHelper`** — lista apps via `PackageManager.queryIntentActivities(MATCH_ALL)`, codifica cada ícone como PNG base64 96×96 para a UI mostrar.
- **`AppBlockerService`** — foreground service:
  - Notificação persistente "Modo foco ativo" com action "Encerrar foco" e tap que reabre o app.
  - A cada 800ms consulta `UsageStatsManager` para descobrir o app em foreground.
  - Se for bloqueado: adiciona overlay via `WindowManager.addView(TYPE_APPLICATION_OVERLAY)` + dispara `ACTION_HOME`.
  - Se foreground volta ao FocusQuest: esconde overlay.
  - Se for launcher ou outro app neutro: **mantém** overlay visível. Esconder automaticamente criava bug de "overlay pisca e some" (porque o `ACTION_HOME` que nós mesmos disparamos levava ao launcher, escondendo a overlay logo após mostrá-la).

**Decisão arquitetural importante:** a primeira versão lançava uma `BlockOverlayActivity` pelo service, mas o Android 10+ bloqueia background activity starts mesmo com `FLAG_ACTIVITY_NEW_TASK`. Migramos para overlay via `WindowManager`, que é o uso canônico de `SYSTEM_ALERT_WINDOW` e funciona de forma confiável. A Activity foi removida do código e do manifest.

---

## 6. Convenções e princípios

- **Imutabilidade** rigorosa nas entidades — evita bugs de mutação acidental em React e simplifica raciocínio.
- **Branded types** para tipos com semântica de unidade.
- **Discriminated unions** para tipos polimórficos (`RecurrenceRule`, `AchievementRequirement`) — o compilador força tratamento exaustivo.
- **Erros estruturados** como subclasses de `DomainError` com `code`, não strings opacas.
- **Upsert via `ON CONFLICT`** evita decidir create vs update na aplicação.
- **DI manual** sem framework — funciona bem nesta escala.
- **Strings hardcoded em português brasileiro** — sem i18n; eixo de extensão futuro.

---

## 7. Limitações conhecidas

Cada uma é um vetor possível de aprofundamento em pesquisa:

- **Preferências de tema não persistem** entre sessões — vivem só no estado do `ThemeProvider`.
- **Sem testes automatizados** — domínio foi escrito para ser testável, mas a suíte não existe ainda.
- **Bloqueio só Android** — iOS exigiria Screen Time API com modelo totalmente diferente.
- **Recorrência customizada** (a cada N dias) agenda só 20 ocorrências futuras por limitação do expo-notifications. Solução robusta exigiria background task lidando com Doze Mode.
- **Sem backup/export do banco** — desinstalar perde tudo.
- **Multi-usuário não implementado** — sempre opera com o primeiro usuário criado.
- **Parâmetros de gamificação não calibrados empiricamente** — valores por intuição de design. Validação com público real (estudo longitudinal, comparando calibrações diferentes) seria contribuição empírica genuína.
- **Sem validação formal com público-alvo** — princípios derivados da literatura sobre TDAH, mas não testados em estudo de uso com usuários diagnosticados.
