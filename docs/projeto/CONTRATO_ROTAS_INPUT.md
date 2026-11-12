# Next frontend — fronteira de entrada de rotas e API NestJS

**NEXT-ROUTES v1.1.0 proposta · 12/11/2026 · branch `fix/routes-input-validation-upstream-errors-20261112`**. Independente de produção/Vercel, empilhada no PR documental #2.

## Arquitetura concreta

O frontend Next.js 15 recebe dados do navegador (`FormData`, query params e IDs em URL), consulta a API `NEST_API_URL` em Server Components e Server Actions e apresenta trajetos do Google Maps. A API NestJS deve continuar sendo a **autoridade** para validar usuário, autorização, estado de cada rota e operações de escrita; validação no frontend **não substitui autenticação**.

### Contratos introduzidos em `src/utils/route-input.ts`

| Entrada | Regra |
|---|---|
| `route_id`, `routeId` | String com 1–128 caracteres; ASCII alfanumérico inicial, seguido de alfanumérico, hífen ou sublinhado. Recusar `../`, `/`, `%2f`, `?`, `#`, quebras de linha e `File` do FormData. |
| `sourceId`, `destinationId` | Place ID de 1–256 caracteres ASCII `[A-Za-z0-9_-]` após opcional prefixo `place_id:`. Origem/destino idênticos são rejeitados na ação de criação. |
| Origem/destino de busca | Texto de 1–120 caracteres após `trim`, sem caracteres de controle. Parâmetros de busca construídos por `URL.searchParams.set`, não concatenação de `?text=${...}`. |
| `NEST_API_URL` | Obrigatória no servidor e restrita a origin HTTP(S) sem credenciais, path extra, query ou fragment. HTTP é mantido para Docker/rede interna de laboratório: **não representa TLS de produção**. |
| Resposta de `/directions` | Exige primeira rota, primeira leg, endereços não vazios até 300 caracteres e Place IDs válidos. Não executar POST de criação com resposta parcial. |

### Server Actions e Route Handler

- `startRouteAction`: falha antes do `fetch` diante de route ID inválido ou ausência de URL de API. Uma chamada `POST /routes/{id}/start` retorna sucesso **somente** com HTTP 2xx. Erros de rede/timeout/status são relatados com mensagem genérica e sem registrar body do backend.
- `createRouteAction`: valida dois IDs, verifica o formato de `/directions` e só depois emite `POST /routes`; atributos são serializados por `JSON.stringify` e a tag `routes` é revalidada apenas após sucesso HTTP.
- `GET /api/routes/[routeId]`: recusa ID inválido com **400**, upstream 404 com **404**, erro upstream/JSON com **502** e URL de backend ausente/inválida com **503**. Usa `no-store` para não compartilhar cache de detalhes de rota entre requisições sem autenticação. A política de autorização continua pendente.
- `searchDirections` no Server Component de nova rota: codifica buscas e valida candidatos/leg; retira log de textos pesquisados.
- `start-route.action.tsx` redundante (cópia do arquivo `.ts`) foi excluído para não haver duas fontes quase iguais de mesma Server Action.

### Limitações de segurança que ainda são P0

1. **Não há autenticação nem autorização do operador nas Server Actions ou no Route Handler.** Ainda é possível enviar mutações diretamente se o backend não proteger. Exigir identidade confiável no NestJS, política por rota/usuário e E2E antes de deploy.
2. `NEST_API_URL` pode ser HTTP na rede Docker; a configuração não introduz TLS. Usar HTTPS de produção, firewall e mTLS/conexão autenticada onde aplicável.
3. Não foram testados Socket.IO e eventos de GPS falsificados, mapa Google real, permissão de API Keys e rastreamento em background.
4. Dependências antigas (`next@15.0.3` e React 19 RC) exigem auditoria e upgrade separados, com testes de compatibilidade e bundle. Não reativar Vercel.
5. Formato de `DirectionsResponseData` é validado apenas para campos usados na criação; não demonstra que a geolocalização, trajetos ou distâncias do fornecedor estejam corretos.

[Plano próprio](../testes/ROTAS_VALIDADAS.md) · [Diagrama editável](../uml/03_validacao_rotas_nest.puml) · [Versionamento](../controle/VERSIONAMENTO.md).

## Gate de segurança externo a este contrato

[GitHub Actions #43228455191](https://github.com/DanieldeAlmeida2024/next-frontend/actions/runs/43228455191) aprovou Node/Python/TS no commit `84cdd2f31844efc09c9922aa6d552ac9ccfdf229`, mas o inventário npm mostra **14 findings runtime** (2 críticos, 10 altos e 2 moderados), além de 23 no inventário completo. A correção de parâmetros **não mitiga esses pacotes**. O desenvolvimento seguro depende de upgrade testado conforme [issue #5](https://github.com/DanieldeAlmeida2024/next-frontend/issues/5), de autorização por usuário/rota conforme [issue #4](https://github.com/DanieldeAlmeida2024/next-frontend/issues/4) e de testes `next build`/E2E antes de produção.
