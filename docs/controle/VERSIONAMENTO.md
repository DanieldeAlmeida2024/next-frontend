# Controle de versões — next-frontend

**1.0.0**, 11/11/2026. Referência de código: `11a4c17269eac032ecdd0ff113cdcedb6137f827`.

| Artefato | Versão | Link |
|---|---|---|
| Especificação | 1.0.0 | [Projeto](../projeto/ESPECIFICACAO.md) |
| Diagramas | 1.0.0 | [UML](../uml/README.md) |
| Testes | 1.0.0 | [Plano](../testes/PLANO_DE_TESTES.md) |

MAJOR: contrato quebrado, MINOR: fluxo novo, PATCH: revisão editorial. Evidências associadas ao SHA do código.

## NEXT-ROUTES v1.1.0 proposta — 12/11/2026

| ID | Artefato | Contrato alterado |
|---|---|---|
| NEXT-ID | `src/utils/route-input.ts` | Valida IDs opacos de rotas, Place IDs, texto de busca, API origin, shape de directions |
| NEXT-START | `src/app/driver/start-route.action.ts` | Recusa route ID inválido, status HTTP 4xx/5xx e rede indisponível, com timeout |
| NEXT-CREATE | `src/app/new-route/create-route.action.ts` | Parâmetros de place validados, directions obrigatório antes do POST, JSON seguro |
| NEXT-GET | `src/app/api/routes/[routeId]/route.ts` | 400/404/502/503 explícitos e cache no-store de detalhes |
| NEXT-SEARCH | `src/app/new-route/page.tsx` | URL.searchParams e verificação de leg/candidatos; remove log de busca |
| NEXT-DEDUP | `src/app/driver/start-route.action.tsx` | Removida cópia duplicada da action `.ts` |
| NEXT-TEST | `tests/route-input.test.cjs` e `tests/test_route_wiring.py` | Sete testes Node determinísticos e inspeções estáticas de ordem das validações |
| NEXT-CI | `.github/workflows/route-input-ci.yml` | npm ci, teste isolado TS, Node tests, Python wiring e tsc --noEmit |
| NEXT-DOC | `docs/projeto/CONTRATO_ROTAS_INPUT.md`, `docs/testes/ROTAS_VALIDADAS.md`, `docs/uml/03_validacao_rotas_nest.puml` | Especificação, matriz de testes e UML próprios |

**Sem merge/deploy/Vercel.** A validação de entrada não substitui autorização pelo NestJS. Pendências: E2E, Socket.IO, autenticação por operador, TLS e dependências antigas. Registrar SHA e CI depois da verificação final.
