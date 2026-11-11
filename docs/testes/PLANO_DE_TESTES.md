# Next.js painel de rotas — plano de testes

> **ROTA-WEB-DOC v1.0.0** | 11/11/2026 | commit `11a4c17269eac032ecdd0ff113cdcedb6137f827` | inspeção estática, sem acesso ao ambiente hospedado.


## Camadas
Testes de Server Actions com mocks de `fetch`; componentes de mapa com cliente de API simulado; E2E com browser e NestJS de homologação. Não foi encontrada suíte funcional TypeScript no snapshot (há `tests/test_documentacao.py` estrutural).

| ID | Prioridade | Caso | Aceitação |
|---|---|---|---|
| ROT-WEB-01 | P0 | Criar rota com Place IDs válidos | GET directions, POST routes, revalidateTag |
| ROT-WEB-02 | P0 | Directions retorna sem `routes[0]` | Erro explícito, sem acesso a índice inexistente |
| ROT-WEB-03 | P0 | `NEST_API_URL` ausente | Configuração detectada antes de request |
| ROT-WEB-04 | P0 | POST routes retorna 500 | `{error}`, sem sucesso falso |
| ROT-WEB-05 | P1 | `sourceId` e `destinationId` inválidos | Rejeitar antes de chamada externa |
| ROT-WEB-06 | P0 | start-route sem route_id | Retorno Route ID is required |
| ROT-WEB-07 | P0 | start-route com rota de outro usuário | Autorização validada no backend |
| ROT-WEB-08 | P1 | GET proxy por routeId | JSON e cache tags corretos |
| ROT-WEB-09 | P1 | Alterar rota após cache | Atualização visível no detalhe |
| ROT-WEB-10 | P1 | Socket.IO desconecta e reconecta | Pontos do motorista retomados |
| ROT-WEB-11 | P0 | Duas rotas com sockets simultâneos | Eventos de uma não vazam para outra |
| ROT-WEB-12 | P1 | `npm run build` | Build sem erros TypeScript |

## Evidências
Executar em CI `npm ci && npm run build`, acrescentar testes de Server Actions e E2E com dados sintéticos. Registrar commits tanto de frontend quanto de NestJS; caso contrário, a execução do fluxo ponta a ponta não é reproduzível.
