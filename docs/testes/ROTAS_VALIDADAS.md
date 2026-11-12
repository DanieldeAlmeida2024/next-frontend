# Next frontend — testes de validação de rotas e erros upstream

**NEXT-ROUTES-TST v1.1.0 proposta · 12/11/2026**

| ID | Camada | Caso e critério |
|---|---|---|
| RT-01 | Node/TypeScript | IDs simples/UUID e tamanho máximo são permitidos |
| RT-02 | Node/TypeScript | Traversal, `/`, `?`, `#`, caracteres de controle, IDs longos ou `Blob` são recusados |
| RT-03 | Node/TypeScript | Place ID válido/normalizado sem `place_id:` aceito; tentativa de injeção recusada |
| RT-04 | Node/TypeScript | Texto de busca com espaços/acentos permitido, entradas vazias ou controles rejeitadas |
| RT-05 | Node/TypeScript | URL NestJS contém apenas origin HTTP(S), sem userinfo/path/query/fragment |
| RT-06 | Node/TypeScript | Construtor de URL interna bloqueia tentativa de substituir origin com `//host` |
| RT-07 | Node/TypeScript | Directions com legs/place IDs aceito; dados ausentes ou malformados rejeitados |
| RT-08 | Python wiring | Validação antes de `fetch` em `startRouteAction` e `createRouteAction` |
| RT-09 | Python wiring | Sem console de payload upstream; `no-store` e erro explícito |
| RT-10 | Python wiring | GET /api/routes/:id retorna 400/404/502/503 conforme cenário |
| RT-11 | Python wiring | `source`/`destination` via `searchParams`, sem concatenação |
| RT-12 | TypeScript | `npx tsc --noEmit` da aplicação completa |
| RT-13 | E2E pendente | NestJS real, autorização por operador, GPS e Socket.IO |
| RT-14 | Integração pendente | Build de produção Next + Google Maps, deploy e latência |
| RT-15 | Segurança pendente | SSRF/validação de destino de rede, identidade server-side e rate limit |

### Comandos reproduzíveis

```sh
npm ci
npx tsc --target ES2020 --module commonjs --lib ES2020,DOM --strict --skipLibCheck --rootDir src --outDir .test-build src/utils/route-input.ts
node --test tests/route-input.test.cjs
python3 -m unittest discover -s tests -p test_route_wiring.py -v
npx tsc --noEmit
```

O build isolado de `route-input.ts` é determinístico e não executa a API, banco, Socket.IO ou Google Maps. O workflow `.github/workflows/route-input-ci.yml` executa os testes e validação completa de tipos, **mas não prova autorização no backend** nem garante `next build` pronto para produção. Registrar o SHA e os jobs efetivos antes de marcar PASS.

### Evidência CI e dependências que ainda bloqueiam publicação

[Runs #43227794803](https://github.com/DanieldeAlmeida2024/next-frontend/actions/runs/43227794803) e [#43227935023](https://github.com/DanieldeAlmeida2024/next-frontend/actions/runs/43227935023): **SUCCESS** no commit `2923b600aee9a6366a18e09b62b33f0788a81061`, sete testes `node:test`, cinco testes Python wiring e `npx tsc --noEmit`. O workflow de `npm ci` relatou 23 vulnerabilidades (5 moderate, 16 high, 2 critical) no pacote completo instalado. Inventário separado de runtime será emitido pelo CI posterior; ainda **sem atualização de pacotes**. Testes de autorização de usuário no NestJS, TLS e build Next continuam pendentes.

## Evidências e bloqueio real de dependências

CI [#43228455191](https://github.com/DanieldeAlmeida2024/next-frontend/actions/runs/43228455191) no commit `84cdd2f31844efc09c9922aa6d552ac9ccfdf229`: **7 Node PASS, 5 Python PASS e TypeScript PASS**, auditoria full/runtime disponível em artefato (7 dias). Full: 23 findings (5 moderate, 16 high, 2 critical). Runtime --omit=dev: 14 findings (2 moderate, 10 high, 2 critical). Os testes RT-01..12 de validação não corrigem vulnerabilidades nem autorizam operações; revisão de pacotes em [issue #5](https://github.com/DanieldeAlmeida2024/next-frontend/issues/5) e autenticação em [issue #4](https://github.com/DanieldeAlmeida2024/next-frontend/issues/4) permanecem **pendentes**. Sem E2E NestJS ou `npm run build` nesta revisão.
