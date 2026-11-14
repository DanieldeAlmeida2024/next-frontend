# Histórico técnico — interface Next.js do rastreamento

## NEXT 1.2.0 · 14/11/2026 — integração NestJS com credencial privada

- Adicionado `src/utils/route-input.ts`: validação de `routeId`, `placeId`, busca e origem HTTP(S) do backend.
- Adicionado `src/utils/server-routes.ts`: `ROUTES_API_KEY` exigida no servidor, com mínimo de 32 caracteres, nunca exportada como `NEXT_PUBLIC_`.
- Proxy de detalhes `/api/routes/[routeId]`, consulta do motorista e ações de criar/iniciar rota encaminham `x-routes-api-key`, sem registrar resposta bruta do backend e sem cache compartilhado.
- `ALLOW_UNAUTHENTICATED_ROUTE_DEMO=true` habilita explicitamente um laboratório local isolado. Padrão: desabilitado. Esse flag **não** fornece autenticação individual.
- Buscas de locais e respostas de Directions possuem contrato de entrada validado para evitar parâmetros malformados e erros por ausência de resposta.
- Testes `tests/route-input.test.mjs` e `tests/server-routes.test.mjs`, executados no GitHub Actions antes do build.
- Documentação atualizada: README, arquitetura e plano de testes.

### Limitações remanescentes

Sem autenticação de usuário, autorização por rota, hardening do Socket.IO e políticas de abuso de Maps, a demonstração **não pode ser exposta em rede pública**. Testes do contrato não comprovam operação E2E com Google Maps, MongoDB e Kafka.

## Histórico anterior

As revisões anteriores estão descritas nos commits e nos documentos de arquitetura e testes do repositório. Não reinterpretar build bem-sucedido como homologação de produção.

## Reconciliação de diagramas — 14/11/2026

Recuperadas especificação histórica, matriz de casos e UML original, mantendo toda a configuração e os testes vigentes da `main`. A documentação antiga foi identificada como material de referência, não como evidência de homologação.

## Diagrama de segurança do contrato de rotas — 14/11/2026

Atualizada a sequência `docs/uml/03_validacao_rotas_nest.puml` com o código real do Next: validação de rota, `ROUTES_API_KEY` privada servidor-servidor, flag explícita de demonstração local, erros fail-closed e limites de autorização. Substitui a UML histórica do PR #3 de 12/11, que não incluía as alterações integradas em #17. Nenhum código ou segredo mudou nesta revisão.
