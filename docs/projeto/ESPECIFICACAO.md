# Painel de rotas Next.js — especificação

> **ROTA-WEB-DOC v1.0.0** | 11/11/2026 | commit `11a4c17269eac032ecdd0ff113cdcedb6137f827` | inspeção estática, sem acesso ao ambiente hospedado.


## Funções reais
Frontend do sistema de simulação de entregas baseado em **Next.js 15.0.3**, React 19 RC, Google Maps JS API, Socket.IO e Server Actions. A API externa é a do projeto NestJS e a URL base deve ser configurada por `NEST_API_URL` no ambiente do servidor.

## Mapa de telas
`src/app/new-route/page.tsx` e `NewRouteForm.tsx` ajudam a cadastrar rota entre locais; `src/app/driver/page.tsx`, `MapDriver.tsx` e `StartRouteForm.tsx` exibem/iniciam rastreamento; `src/app/admin/page.tsx` é painel administrativo. `src/app/api/routes/[routeId]/route.ts` faz proxy de consulta de rota.

## Contrato de criação
`createRouteAction` lê `sourceId` e `destinationId`, consulta `GET ${NEST_API_URL}/directions?originId=...&destinationId=...`, obtém endereços de `routes[0].legs[0]`, então envia `POST /routes` com `name`, `source_id` e `destination_id`, removendo o prefixo `place_id:`. Após sucesso, chama `revalidateTag('routes')`. Falhas de requests retornam `{error: ...}`.

`startRouteAction` requer `route_id`, envia `POST /routes/:route_id/start` e devolve `success` ou `error`. A route handler `GET /api/routes/[routeId]` consulta NestJS com `force-cache` e tags de invalidação `routes-<id>` e `routes`.

## Dependências e riscos
- `src/app/driver` usa WebSocket para posições; validar separação entre usuário legítimo e outro usuário.
- `createRouteAction` assume `routes[0].legs[0]` existente. Resposta do Google sem rota pode causar exceção antes de retorno claro.
- `NEST_API_URL` precisa de definição no serviço; cliente não deve receber credencial de Google Maps destinada ao servidor.
- Não confiar em IDs de `FormData` sem validação de formato e autorização.
- `revalidateTag('routes')` não garante invalidar cada chave de detalhe em `routes-<id>` quando os dados do motorista mudam.
- `package.json` contém `next lint`; confirmar compatibilidade com versão instalada antes de afirmar que lint funciona.

## Execução
```bash
npm ci
npm run build
npm run dev
```
Configurar serviços NestJS, Kafka/MongoDB e credenciais de mapa em ambiente de laboratório; não publicar chave real.
