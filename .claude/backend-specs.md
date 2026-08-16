# Diretrizes de Backend do App do Motorista (RookHub)

> Documento de engenharia derivado de `docs/specsMobile/files/`:
> `app_motorista_backend_spec.md` (`DRV-SPEC`), `app_motorista_contratos_api.md` (`DRV-API`) e
> `app_motorista_regras_negocio_uc.md` (`DRV-RN`).
>
> **Hierarquia de autoridade:** as specs em `docs/specsMobile/` são a fonte de verdade de contrato e
> regra de negócio. Este arquivo é a camada de implementação: convenções, arquitetura, ordem de
> trabalho e critérios de aceite. Quando divergirem, a spec vence e este arquivo é corrigido.
> Divergências conhecidas estão listadas na seção 12 e não devem ser resolvidas por conta própria.

**Índice:** Escopo · Stack · Estrutura de módulos · Convenções de código · Contrato HTTP ·
Autenticação · Multi-tenancy · Validação · Sincronização · Mídia · Roadmap · Divergências ·
Definição de pronto · Gotchas de backend

---

## 1. Escopo e limite de repositório

- Este repositório (`System-mobile`) contém **somente o aplicativo Expo do motorista**. Nenhum
  código Java, `pom.xml`, `docker-compose.yml`, migração Flyway ou pasta `src/main/` entra aqui.
- O backend vive em repositório irmão próprio (a criar, ver `P-BE-01` na seção 12). Enquanto ele não
  existir, o trabalho de backend produz **contrato e especificação**, não código de servidor.
- O que este repositório recebe do backend: o contrato OpenAPI 3.1 e o cliente TypeScript gerado,
  que substituem gradualmente `src/mocks/` por trás de `src/features/<nome>/api.ts`. As telas não
  mudam de forma, porque já consomem a camada `api.ts` e nunca o mock direto.
- Regra de migração do app: um domínio por vez. Trocar `src/mocks/<domínio>` por chamada HTTP dentro
  de `api.ts`, mantendo a mesma assinatura de função. Sem essa disciplina a substituição vira
  reescrita de interface.

## 2. Stack fixa

| Camada | Decisão |
|---|---|
| Linguagem | Java 21 |
| Framework | Spring Boot 3.x com Spring Modulith |
| Banco | PostgreSQL com RLS e `FORCE ROW LEVEL SECURITY` em toda tabela multi-tenant |
| Migrações | Flyway, versionadas, sem alteração manual de schema em nenhum ambiente |
| Objetos | Cloudflare R2, acesso exclusivamente por URL assinada |
| Formato de erro | RFC 9457 (`application/problem+json`) |
| Contrato | OpenAPI 3.1 gerado a partir do código, publicado a cada merge |
| Fuso | Armazenamento em UTC; apresentação em America/Sao_Paulo (RNF-017) |
| Identificadores | UUID v7 em toda entidade |
| Dinheiro | Inteiro em centavos + `currency`, sempre `"BRL"` no MVP (RN-132) |

**Não introduzir** sem decisão registrada: Kafka, GraphQL, gRPC, cache distribuído, microsserviços,
ORM alternativo ou segundo banco. O produto é um modular monolith por decisão de arquitetura.

## 3. Módulos Spring Modulith

Paridade de nome com as fatias do frontend é princípio do projeto (`API-D15`).

| Módulo | Responsabilidade | Rotas do motorista |
|---|---|---|
| `identity` | Motorista, aparelho, PIN, tokens, termo LGPD | `/auth/*`, `/consent-term/*` |
| `fleet` | Veículo, composição, status, pendências | `/vehicles/{id}/pendencies` |
| `checklist` | Template versionado, submissão, bloqueio de veículo | `/checklists/*` |
| `trip` | Máquina de estados, pausas, ocorrências, trajeto | `/trips/*`, `/telemetry/location` |
| `maintenance` | Consome eventos de pendência | nenhuma |
| `cost` | Comprovante de abastecimento e vinculação | `/fuel/receipts` |
| `safety` | Eventos e contestação | `/safety/*` (bloqueado, ver `P-06`) |
| `notification` | Entrega e leitura | `/notifications/*` |
| `media` | Intent, assinatura e confirmação de objeto | `/media/*` |
| `driver-bff` | Agregação para o app | `/home`, `/bootstrap`, `/profile`, `/performance`, `/sync/batch` |

**Regra dura sobre o `driver-bff`:** ele compõe respostas por portas publicadas e eventos dos demais
módulos. Não contém regra de negócio, não acessa tabela de outro módulo e não decide status. Se uma
regra precisar aparecer no `GET /home`, ela é implementada no módulo dono e exposta por porta.
Sem essa fronteira, `GET /home` vira o depósito de toda a regra do produto.

Teste de arquitetura obrigatório: `ApplicationModules.of(...).verify()` roda no CI e falha o build em
dependência cíclica ou acesso a pacote interno de outro módulo.

## 4. Convenções de código

- Pacote raiz: `com.rookhub.<módulo>`. Dentro de cada módulo: `api` (controllers e DTOs públicos),
  `domain` (entidades e regras), `application` (casos de uso), `infra` (repositórios e adaptadores).
  Somente `api` e as portas declaradas são visíveis a outros módulos.
- Nomes de classe, pacote, coluna e endpoint em inglês. Texto voltado ao motorista em pt-BR, sempre
  vindo de `driverMessage` ou de catálogo de mensagem, nunca concatenado no controller.
- DTO de entrada e de saída são `record` imutáveis, separados da entidade. Entidade JPA nunca é
  serializada diretamente na resposta.
- Enumerações no contrato em `SCREAMING_SNAKE_CASE`, estáveis e **nunca traduzidas** no payload.
  `CONFORME`, `NAO_CONFORME` e `NAO_APLICAVEL` são chaves; a tradução é da camada de apresentação.
- Evolução de enum é **aditiva**. Remover ou renomear valor é quebra de contrato e exige nova versão
  de caminho. O cliente em campo pode estar semanas atrás (`RNF-D-052`).
- Caso de uso é transacional e idempotente por natureza. Efeito colateral (notificação, pendência,
  mudança de status de veículo) é disparado por evento de domínio publicado **após** o commit,
  jamais dentro do controller.
- Nada de `Optional` em campo de entidade, nada de lógica de negócio em `@Entity`, nada de
  `@Transactional` em método privado ou em controller.
- Log estruturado obrigatório com `X-Request-Id`, `tenant_id`, `driver_id` e `client_uuid`
  (`RNF-D-030`). Investigar "o checklist não chegou" sem `client_uuid` é impossível: o registro
  existe no aparelho e em lugar nenhum do servidor.
- Proibido logar PIN, hash de PIN, `deviceToken`, `accessToken`, CPF completo ou URL assinada.

## 5. Contrato HTTP

Prefixo comum: `/api/v1/driver`. Versionamento por caminho.

### 5.1 Cabeçalhos

Requisição: `Authorization: Bearer <access_token>` (exceto ativação e login), `Idempotency-Key`
(obrigatório em todo POST de criação, igual ao `client_uuid`), `X-Device-Id`, `X-Client-Version`,
`X-Request-Id` (recomendado), `If-None-Match` em `GET /checklists/template` e `GET /bootstrap`.

Resposta: `X-Request-Id`, `ETag` em recurso cacheável, `Retry-After` em `429` e `503`,
`X-Server-Time` em toda resposta. O `X-Server-Time` é o que permite ao app avisar o motorista antes
de a deriva de relógio virar flag de auditoria: prevenir é melhor que sinalizar.

### 5.2 Erros

Toda falha responde `application/problem+json` com `type`, `title`, `status`, `detail`, `instance`,
`requestId` e, quando houver validação de campo, `errors[]` com `field`, `code` e o rótulo do item.

Catálogo mínimo de `type` (completo em `DRV-SPEC` §3): `invalid-credentials` (401),
`account-locked` (423), `device-not-bound` (403), `activation-token-expired` (410),
`consent-term-required` (428), `driver-license-expired` (409), `vehicle-unavailable` (409),
`checklist-photo-required` (422), `checklist-template-outdated` (409), `odometer-inconsistent` (422),
`trip-invalid-transition` (409), `idempotency-conflict` (409), `entitlement-missing` (403),
`rate-limited` (429), `period-closed` (409).

**Classificação que o app usa para decidir o destino do item na fila:** `4xx` que não seja `408`,
`423` ou `429` é erro **permanente** e sai da fila para "Requer atenção". `408`, `429`, `5xx` e falha
de rede são **transitórios** e permanecem com backoff. Escolher o código errado faz o app reenviar em
laço ou descartar um checklist de freio: essa classificação é decisão de contrato, não de conveniência.

Texto de `title` e `detail` é lido por pessoa em campo. Linguagem de operação, o que aconteceu e o
que fazer agora, nunca código técnico (`RNF-D-044`).

### 5.3 Idempotência

1. `Idempotency-Key` obrigatório em todo POST de criação e igual ao `client_uuid` do registro.
2. Chave armazenada com escopo `(tenant_id, driver_id, endpoint, key)` e TTL de **7 dias**, alinhado
   à capacidade da fila (RNF-010).
3. Repetição com payload idêntico: `200` com a resposta original e `Idempotent-Replay: true`.
4. Repetição com payload divergente: `409 idempotency-conflict`.
5. Nenhum efeito colateral pode disparar duas vezes pela mesma chave. A gravação da chave e o efeito
   ocorrem na mesma transação.

### 5.4 Paginação e limites

Cursor opaco: `?limit=20&cursor=...`, resposta `{ items, nextCursor, hasMore }`. `limit` padrão 20,
máximo 50. Teto deliberadamente baixo porque o alvo é 3G em rodovia.

### 5.5 Rate limiting (RNF-021)

Login 10/15min · telemetria 120/h (lote de até 60 pontos) · upload-intents 200/h · escritas de
domínio 60/h · leituras 600/h. Por motorista, mais limite por tenant na borda. Excedido responde
`429` com `Retry-After`.

### 5.6 Payload magro

Nenhum endpoint do motorista retorna campo que a tela não usa, e **nenhum retorna campo financeiro**:
custo, preço, litros, ranking ou consolidado. Isso é asserção automatizada sobre o OpenAPI, não
revisão manual (`RN-D-050`, Anexo A).

## 6. Autenticação e JWT

O motorista não tem e-mail nem senha. Acesso por CPF + PIN de 6 dígitos, provisionado por QR code.

| Token | Duração | Onde vive | Rotação |
|---|---|---|---|
| `access_token` (JWT, RS256) | 15 min | memória do app, nunca em disco | a cada refresh |
| `device_token` | 90 dias | armazenamento seguro do aparelho, cifrado | rotativo e revogável |
| hash local do PIN (Argon2id) | vida do vínculo | armazenamento local do app | invalidado em reset |

Claims obrigatórios: `sub`, `tenant_id`, `role`, `driver_id`, `device_id`, `entitlements`,
`consent_version`, `jti`, `iat`, `exp`. Chave assíncrona, `jti` verificável para revogação.

Fluxo: QR de uso único válido por 48h (RN-008) gera `POST /auth/device/activate`, que vincula
aparelho a motorista de forma **única** (RNF-012), define o PIN e devolve `pinHashParams` para o app
derivar o hash local de validação offline (RN-009). O PIN em claro nunca é persistido em lugar nenhum,
nem no servidor, nem no aparelho.

Regras que o servidor aplica sem exceção: 5 tentativas incorretas bloqueiam por 15 minutos (RN-010) e
o servidor sempre vence a divergência com o contador local; PIN fraco (sequência, repetição ou data de
nascimento) é recusado com `422` e razão específica (`RN-D-010`); revínculo de aparelho exige novo QR
(`RN-D-011`); rotação de `device_token` revoga o anterior de imediato e reuso de token revogado
invalida toda a cadeia do aparelho.

CPF é único **por tenant**, não globalmente (RN-007). Resolução de tenant no login: primeiro por
`X-Device-Id`; sem aparelho vinculado e com CPF em mais de um tenant, responder `300` com apenas
`tenantId` e nome fantasia. Nenhum outro dado é exposto antes da autenticação.

**Termo LGPD é gate bloqueante** (`RN-D-060`): enquanto `consent_accepted_at` for nulo ou a versão
aceita for anterior à vigente, toda rota que não seja de autenticação ou do próprio termo responde
`428 consent-term-required`. O motorista pode recusar, e a recusa **não** bloqueia a conta
(`RN-D-062`): bloquear transformaria legítimo interesse em coação.

## 7. Multi-tenancy

**Regra inegociável:** `tenant_id` vem **exclusivamente** do claim do JWT. Nenhum endpoint aceita
tenant por cabeçalho, query ou corpo. `X-Tenant-Id` presente na requisição é ignorado e registrado
como anomalia de segurança (`RNF-D-023`).

Toda requisição autenticada abre transação por `TenantContext.withTenant()`, ponto único de acesso ao
banco, com `set_config(..., true)` de escopo transacional. RLS ativa e `FORCE ROW LEVEL SECURITY` em
toda tabela tocada pela API. Um `@Repository` alcançado fora do `withTenant()` é falha de build, não
falha de runtime: cobrir com teste de arquitetura.

Autorização em duas camadas, **antes** de qualquer acesso a dado:

```java
@RequiresEntitlement(Module.MAINTENANCE)   // o plano contratado inclui?
@PreAuthorize("hasRole('DRIVER')")         // o papel pode executar?
```

Escopo `apenas próprios registros`: o filtro por `driver_id` do token é aplicado **no repositório**,
não no controller. Recurso de outro motorista responde `404`, nunca `403` (`RNF-D-024`): a existência
do recurso alheio não é confirmada.

O `DRIVER` **não** lança abastecimento, não vê custo por km nem ranking, não libera veículo bloqueado
e não trata pendência. Isso é aplicado no backend, não escondido na interface.

## 8. Validação

Ordem de execução em toda escrita: autenticação, gate de consentimento, entitlement, papel, escopo de
propriedade, idempotência, validação de forma (Bean Validation), regra de negócio, persistência,
evento de domínio pós-commit.

Regras que **bloqueiam** o envio, com o `type` correspondente:

| Situação | Resposta |
|---|---|
| Item obrigatório sem resposta (`RN-D-015`) | `422 checklist-incomplete` |
| `NAO_CONFORME` sem severidade (`RN-D-016`) | `422 checklist-invalid-severity` |
| Severidade `CRITICO` sem foto (RN-038) | `422 checklist-photo-required` |
| `NAO_APLICAVEL` em item que não permite (`RN-D-017`) | `422` |
| Mais de 3 fotos por item (RN-039) | `422 media-limit-exceeded` |
| Odômetro menor que a última leitura, ou acima dela em mais de 2.000 km sem viagem (`RN-D-014`) | `422 odometer-inconsistent` |
| Odômetro final menor que o inicial (`RN-D-029`) | `422 odometer-inconsistent` |
| Transição fora da máquina de estados (RN-026) | `409 trip-invalid-transition` |
| Veículo indisponível no início de viagem (RN-027) | `409 vehicle-unavailable` |
| CNH vencida (RN-024) | `409 driver-license-expired` |
| `objectKey` sem confirmação prévia em `/media/confirm` | `422 media-not-confirmed` |

Regras que **não** bloqueiam e apenas sinalizam:

- Checklist de saída vencido (mais de 4h): a viagem inicia com flag `STARTED_WITHOUT_VALID_CHECKLIST`
  e o operador é notificado (RN-037). Bloquear a partida transformaria regra de qualidade em
  impedimento operacional, e o motorista aprenderia a burlar o checklist.
- Divergência de relógio acima de 6h: gera `CLOCK_DIVERGENCE` e **não** rejeita o registro (RN-054).
- Divergência acima de 5% entre distância de odômetro e de GPS: gera `ODOMETER_GPS_DIVERGENCE`,
  visível ao gestor e **não mencionada** na resposta ao app (RN-060). O motorista não é acusado.
- Submissão em versão antiga de template vigente à época: **aceita**, nunca rejeitada (RN-033).

Critério de admissão de qualquer validação nova (`RN-D-001`): precisa ter justificativa de segurança
física ou de integridade de indicador. Validação de conveniência administrativa é rejeitada por
princípio, porque aumenta o tempo do checklist e checklist que não é preenchido derruba o pilar de
manutenção inteiro.

## 9. Sincronização e offline

O app é offline-first: escreve local primeiro e sincroniza depois. A API é o destino da fila, não o
caminho crítico da interação. O servidor é a autoridade (RN-053): toda resposta de escrita devolve
`serverState`, e o app substitui o estado local por ele.

`POST /sync/batch` recebe até 20 operações e responde **`207 Multi-Status`** com resultado individual.
Uma falha não derruba o lote. `outcome` por operação: `CREATED`, `IDEMPOTENT_REPLAY`,
`PERMANENT_FAILURE` (com `problem` e `driverMessage`) ou `TRANSIENT_FAILURE` (com `retryAfterSeconds`).

Ordem de processamento no servidor: por `priority` crescente e, dentro da mesma prioridade, por
`filledAt`. Operações da mesma viagem são **serializadas**: um `TRIP_FINISH` nunca é processado antes
do `TRIP_START` correspondente no mesmo lote.

Dois relógios, dois campos, ambos imutáveis (RN-054): `filledAt` vem do aparelho, `receivedAt` é do
servidor no aceite, `deviceClockSkewSeconds` é calculado no aceite. Nenhum sobrescreve o outro.

Prioridades da fila, que o servidor precisa respeitar na ordenação: P0 checklist com item bloqueante
crítico, P1 demais checklists e transições de viagem, P2 ocorrências e comprovantes, P3 fotos,
P4 telemetria. A razão de P0 é de negócio: enquanto o checklist não chega, existe um caminhão com
freio comprometido que o sistema considera disponível, o pior estado possível do produto.

`GET /bootstrap` entrega em uma requisição tudo que o app precisa para operar dias sem rede: perfil,
veículo atribuído, pendências abertas, templates com versão, catálogos e `settings` do tenant. Os
limiares de fila e de foto vêm do servidor por decisão deliberada, porque mudam por aprendizado
operacional e não podem exigir novo deploy do app a cada ajuste.

## 10. Mídia

O binário **nunca** trafega pela aplicação. Fluxo: `POST /media/upload-intents` (lote de até 10) para
validar tenant, papel e entitlement e assinar a URL; `PUT` direto ao R2; `POST /media/confirm`, onde o
backend faz `HEAD` e valida tamanho, tipo e hash; o `objectKey` confirmado é referenciado na submissão.

Estrutura de chave:

```
rookhub-media/{tenant_id}/checklists/{ano}/{mes}/{checklist_id}/{item_id}/{uuid}.webp
rookhub-media/{tenant_id}/receipts/{ano}/{mes}/{fueling_id}/{uuid}.webp
```

Limites validados **no servidor**, não só na interface: `image/webp` e `image/jpeg`, máximo 1,5 MB por
objeto, máximo 3 fotos por item, URL assinada com expiração de no máximo 15 minutos (RNF-022), objeto
com intent nunca confirmado expurgado em 48h por lifecycle rule (`RN-D-022`).

O checklist é aceito **com fotos pendentes**, respondendo `photoUploadStatus: "PENDING"`. Consequência
de negócio deliberada: a pendência de manutenção é criada e a equipe é notificada imediatamente, antes
de a foto chegar. Segurar a pendência até a última foto subir atrasaria o tratamento de um freio
comprometido por causa de banda, troca inaceitável.

A data de captura sobrevive à limpeza de EXIF porque é a segunda linha de defesa antifraude: a
validação server-side da data impede reaproveitar a foto de um pneu de outro dia.

## 11. Roadmap de implementação

Ordem aprovada em `DRV-SPEC` §14. Cada sprint só é considerada entregue com o OpenAPI atualizado e a
suíte de testes correspondente verde.

| Sprint | Entrega | Bloqueio |
|---|---|---|
| **0** | Fundação: RLS, `withTenant()`, os 4 gates de autorização, esteira de CI, teste de módulos | nenhum |
| **1** | `identity`: QR, PIN Argon2id, `device_token` de 90 dias, refresh rotativo, gate LGPD | nenhum |
| **2** | `media` + `checklist` completo, com bloqueio de veículo e geração de pendência | nenhum |
| **3** | `trip` + `POST /sync/batch` com idempotência e serialização por viagem | nenhum |
| **4** | `cost`: `POST /fuel/receipts` e job de vinculação ao `fueling` | nenhum |
| **5** | Mapa: adaptadores anticorrupção por fornecedor + `GET /trips/{id}/track` | **P-08** |
| **6** | `/profile` e `/performance` sem `composition` | P-07 (parcial) |
| **--** | `/safety/*`: **não abrir** | **P-06** |

Dentro de cada sprint, a ordem é sempre: migração Flyway, domínio, caso de uso, controller, contrato
OpenAPI, teste. Endpoint sem teste de contrato não fecha sprint.

`POST /telemetry/location` está especificado mas **não entra na sprint 4**: só quando aparecer veículo
sem telemetria instalada na frota-âncora. O trabalho real do Mapa é o adaptador anticorrupção
(RN-138): nenhuma regra de negócio conhece o formato do Powerfleet ou do Eagletrack.

### 11.1 Mapa de endpoint por tela

| Tela | Endpoints |
|---|---|
| Login | `/auth/device/activate`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/consent-term`, `/consent-term/accept` |
| Home | `/home`, `/bootstrap`, `/vehicles/{id}/pendencies`, `/notifications` |
| Checklist | `/checklists/template`, `POST /checklists`, `/checklists`, `/checklists/{id}`, `/media/*` |
| Mapa | `/trips/{id}/track`, `/telemetry/location` (condicional) |
| Abastecer | `POST /fuel/receipts`, `GET /fuel/receipts`, `/media/*` |
| Viagem | `/trips/{id}/start`, `/pause`, `/resume`, `/finish`, `/events`, `GET /trips` |
| Perfil | `/profile`, `/performance`, `/safety/events`, `/safety/events/{id}/dispute` |
| Transversal | `/sync/batch`, `/notifications/*` |

## 12. Divergências e pendências abertas

Nenhuma destas é decidida durante a implementação. Cada uma precisa de decisão registrada antes de
virar código.

| # | Assunto | Situação |
|---|---|---|
| `P-BE-01` | Repositório do backend ainda não existe. Definir nome, visibilidade e esteira de CI antes da sprint 0 | aberto |
| `P-BE-02` | As specs descrevem o cliente como **PWA** (`apps/driver`, IndexedDB, Dexie, service worker, Workbox, Background Sync). Este repositório é um app **Expo/React Native**. O contrato HTTP não muda, mas mudam: o mecanismo de fila local, o armazenamento do `device_token` (keychain por `expo-secure-store`) e o transporte de push | aberto |
| `P-BE-03` | Decorrente de `P-BE-02`: `DRV-SPEC` §9 define **Web Push** e o risco `RT-01` (iOS 16.4+ e instalação na tela de início). Em app nativo o canal passa a ser FCM/APNs e o risco desaparece, o que também afeta a necessidade do fallback por SMS. Confirmar antes de implementar `notification` | aberto |
| `P-BE-04` | `RNF-D-006` (bundle < 300KB) e `RNF-D-015` (`navigator.storage.persist()`) são requisitos de PWA sem equivalente direto em app nativo. Precisam ser reescritos ou retirados | aberto |
| `P-04` | Distribuição Android/iOS na frota-âncora. Não bloqueia as sprints 0 a 3 | aberto |
| `P-05` | Revisão jurídica do termo de ciência. Bloqueia o go-live, não o desenvolvimento | aberto |
| `P-06` | Powerfleet Unity expõe eventos de vídeo por API? Bloqueia `/safety/*` por completo | aberto |
| `P-07` | Fórmula do score de segurança (RN-099). Bloqueia `composition` de `GET /performance`. A composição do exemplo em `DRV-API` §10.2 é estrutura, não fórmula aprovada | aberto |
| `P-08` | Credenciais e documentação de API do Powerfleet e do Eagletrack para posição e odômetro. Bloqueia a sprint do Mapa | aberto |

`P-06` e `P-08` são coisas diferentes e não devem ser tratadas juntas: `P-08` é telemetria de posição,
escopo MVP já aprovado; `P-06` é evento de vídeo com IA, ainda não validado.

## 13. Definição de pronto

Nenhuma entrega desta superfície é considerada pronta sem:

- [ ] Contrato OpenAPI 3.1 publicado e cliente TypeScript gerado
- [ ] Asserção automatizada de que **nenhuma resposta do motorista contém campo monetário**
- [ ] Asserção de que nenhuma rota do motorista retorna registro de outro motorista
- [ ] Teste de reenvio duplicado do mesmo `client_uuid` sem efeito colateral duplicado
- [ ] Teste de concorrência multi-tenant sobre o mesmo pool, sem vazamento
- [ ] Teste de relógio adulterado em 8 horas gerando exatamente uma flag, sem rejeição
- [ ] Teste de lote parcialmente aceito em `POST /sync/batch` com os três `outcome`
- [ ] Teste de rede degradada (3G, 300ms de RTT, 2% de perda) dentro de RNF-005
- [ ] Registro de auditoria verificado para os sete eventos de `DRV-SPEC` §12
- [ ] Métricas publicadas: `driver.sync.batch.duration`, `driver.checklist.sync.duration`,
      `driver.home.duration`, `driver.queue.age`, `driver.queue.stuck`,
      `driver.clock_divergence.rate`, `driver.photo.upload.failure_rate`

Alvos de desempenho: `GET /home` p95 < 800ms, qualquer escrita p95 < 300ms, lote de 20 operações
p95 < 3s, checklist com 10 fotos em 4G < 60s.

## 14. Gotchas de backend

- **Tenant nunca vem do cliente.** Todo bug de vazamento entre tenants começa por uma exceção
  "temporária" a essa regra.
- **Idempotência é correção, não otimização.** O aparelho reenvia por design; o servidor precisa
  suportar isso sem duplicar pendência, notificação ou bloqueio de veículo.
- **Classificar erro como permanente ou transitório é decisão de negócio.** Um `500` onde deveria ser
  `422` mantém um registro girando na fila por 7 dias; um `422` onde deveria ser `503` descarta um
  checklist de freio para "Requer atenção" sem motivo.
- **Efeito colateral só depois do commit.** Notificar o gestor dentro da transação e depois dar
  rollback significa avisar sobre um bloqueio que não existe.
- **`404` e não `403` para recurso de terceiro.** `403` confirma que o recurso existe.
- **Enum é aditivo.** O app em campo pode estar semanas atrás e não pode ficar sem checklist porque
  um valor novo apareceu.
- **Não repetir regra de negócio no `driver-bff`.** Se `nextActions` precisar de uma condição nova, a
  condição pertence ao módulo dono e chega por porta.
- **Foto pendente não segura pendência.** O checklist é aceito com `photoUploadStatus: "PENDING"`.
- **Não devolver ao app a flag de auditoria que acusa o motorista.** `ODOMETER_GPS_DIVERGENCE` é do
  gestor; o app não a menciona.
