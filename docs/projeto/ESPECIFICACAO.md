# Frontend Next.js de rotas, mapas e rastreamento

**Documento v1.0.0**, 11/11/2026, base `11a4c17269eac032ecdd0ff113cdcedb6137f827`. Testes propostos não foram executados neste PR.

## Contexto, regras e contratos
O frontend usa o App Router Next.js e oferece páginas `/new-route`, `/driver` e `/admin`, além de API Route Handler `src/app/api/routes/[routeId]/route.ts`. `createRouteAction` recebe `sourceId` e `destinationId` do `FormData`, consulta `NEST_API_URL/directions`, extrai start/end addresses e cria a rota em `NEST_API_URL/routes`. Após sucesso, chama `revalidateTag("routes")`; mudanças do Next.js exigem validar a assinatura real de `revalidateTag` na versão instalada.

`startRouteAction` exige `route_id` e faz POST para `NEST_API_URL/routes/{route_id}/start`, retornando objeto de sucesso ou erro. O Route Handler de consulta busca a rota e usa cache `force-cache` com tags `routes-{routeId}` e `routes`; esse cache exige estratégia de invalidação quando pontos mudam. `src/utils/socket-io.ts` cria cliente Socket.IO com `NEXT_PUBLIC_NEST_API_URL` e `autoConnect:false`.

No mapa `MapDriver.tsx`, a alteração da rota selecionada inscreve o socket em `server:new-points/{routeId}:list`, busca os detalhes por `NEXT_PUBLIC_NEXT_API_URL`, cria marcadores do veículo/início/fim e move carro a cada evento. O código faz `socket.offAny()` na troca, registra `console.log('aaaaaa')` e assume que o elemento HTML selecionado existe pelo `!;` — pontos de observabilidade/robustez a testar. A URL externa e a API NestJS devem ser configuradas por ambiente; o frontend não é autoridade para validar trajetos.

O Compose e Dockerfile permitem execução em stack, mas dependem da API e do broker configurados. O usuário não deve receber fluxo fingidamente funcional quando o WebSocket estiver fora do ar.

## Verificação do ambiente
```bash
npm ci && npm run build
```

Consulte os [diagramas](../uml/README.md) e a [matriz de testes](../testes/PLANO_DE_TESTES.md); ambos devem ser mantidos sincronizados com o código.
