# Plano de testes — next-frontend

Versão 1.1.0 · 14/11/2026

## Gate automático

```bash
npm ci
npm audit --audit-level=high
npm run lint
npm run build
```

| Caso | Verificação | Evidência esperada |
| --- | --- | --- |
| DEP-01 | Instalação `npm ci` | Manifesto e lockfile consistentes |
| DEP-02 | `npm audit --audit-level=high` | Nenhum alerta alto ou crítico |
| DEP-03 | Linter ESLint local | Código TS/TSX sem erros de lint |
| DEP-04 | `next build` | Compilação TypeScript e geração de bundles aprovadas |
| BUILD-01 | App Router | Páginas exportam somente contratos aceitos pelo Next |
| BUILD-02 | React 19 | Hook `useMap` aceita referência DOM nula até a montagem |
| BUILD-03 | `/driver` | Consulta NestJS em runtime, não durante geração estática |

## Testes ainda não realizados

- **E2E-01:** pesquisar rota com dados reais Places/Directions e criar no NestJS.
- **E2E-02:** iniciar rota e observar eventos Socket.IO durante a simulação.
- **E2E-03:** falha/indisponibilidade do NestJS e UX de recuperação.
- **SEC-01:** impedir usuário sem sessão de acessar `/admin` e ações de criação/início.
- **SEC-02:** restringir a chave Maps por domínio/API e verificar rate limiting.
- **OBS-01:** comportamento com vários clientes, falhas de rede e latência.
- **PRIV-01:** autorizações, consentimento e exposição de posições a terceiros.

**Escopo real da CI:** dependências, audit de severidade alta/crítica, ESLint e build. Ainda há relatórios moderados de dependências transitivas; não são ignorados por npm audit fix --force nem falsamente declarados inexistentes.
