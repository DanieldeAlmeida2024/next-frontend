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

### NEXT-DEPS — evidência de inventário instalada, não remediação (12/11/2026)

- [GitHub Actions #43227935023](https://github.com/DanieldeAlmeida2024/next-frontend/actions/runs/43227935023), commit `2923b600aee9a6366a18e09b62b33f0788a81061`: `npm ci` relatou **23 vulnerabilidades instaladas** (**5 moderadas, 16 altas, 2 críticas**). Esse total ainda mistura dependências de runtime e desenvolvimento, **não é medida de exploração**.
- [Issue #5](https://github.com/DanieldeAlmeida2024/next-frontend/issues/5) documenta triagem/upgrade pendentes de Next 15.0.3, React RC e transitivas. **Não houve atualização de pacote neste PR**.
- O workflow de rota passa a gerar `audit-full.json` e `audit-runtime.json` como artefatos por sete dias e imprimir contagem por escopo. Apenas gate de disponibilidade do relatório, não gate zero vulnerabilidades até que PR específico de dependências remedeie achados. Novas execuções devem ser verificadas antes de citar números.

### Evidência CI NEXT-ROUTES v1.1.0 + NEXT-DEPS — 12/11/2026

- [Actions #43228455191](https://github.com/DanieldeAlmeida2024/next-frontend/actions/runs/43228455191), código e documentos `84cdd2f31844efc09c9922aa6d552ac9ccfdf229`: **SUCCESS**, 7 testes Node, 5 verificações Python wiring e `npx tsc --noEmit`.
- Gate adicional de auditoria gerou dois relatórios `npm audit --json` e `npm audit --omit=dev --json` como artifact `next-frontend-npm-audit` com retenção 7 dias; falha quando npm não fornece metadata confiável. **Não é gate de zero achados.**
- Resultado **full**: 23 vulnerabilidades (5 moderadas, 16 altas, 2 críticas).
- Resultado **runtime --omit=dev**: **14 vulnerabilidades (2 moderadas, 10 altas, 2 críticas)**. A gravidade da dependência não prova exposição explorável, mas requer triagem por pacote e caminho executado.
- [Issue #5](https://github.com/DanieldeAlmeida2024/next-frontend/issues/5) permanece **P0** para revisão/upgrade de Next/React e transitivas. [Issue #4](https://github.com/DanieldeAlmeida2024/next-frontend/issues/4) permanece P0 para autorização NestJS. **Sem autorização para deploy ou merge**.
- Esta alteração é documental e produz novo SHA; conferir novamente checks do HEAD posterior antes de qualquer merge.
