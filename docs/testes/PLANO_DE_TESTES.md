> **Modelo histórico de 11/11/2026.** O backend NestJS agora exige credencial privada; os testes e requisitos vigentes estão em `docs/ARQUITETURA.md`, `docs/PLANO_TESTES.md` e no README atual. Não usar este modelo antigo como evidência de deploy ou autenticação de usuários.

# Testes — Frontend Next.js de rotas, mapas e rastreamento

**Documento v1.0.0**, 11/11/2026, base `11a4c17269eac032ecdd0ff113cdcedb6137f827`. Testes propostos não foram executados neste PR.

| ID | Ação | Critério de aceite | Situação |
|---|---|---|---|
| NEXT-01 | Formulário com Place IDs válidos | Consulta directions e POST /routes | Planejado |
| NEXT-02 | API Directions indisponível | Mensagem Failed to fetch directions | Planejado |
| NEXT-03 | Falha no POST /routes | Não reportar sucesso de criação | Planejado |
| NEXT-04 | Ação start sem route_id | Retorna Route ID is required | Planejado |
| NEXT-05 | Ação start válida | POST /routes/:id/start | Planejado |
| NEXT-06 | GET /api/routes/:routeId | JSON de rota e estratégia de cache | Planejado |
| NEXT-07 | Evento server:new-points/ID:list | Mover veículo na rota correta | Planejado |
| NEXT-08 | Troca de rota no select | Unsubscribe e subscribe sem duplicatas | Planejado |
| NEXT-09 | Remontagem/desmontagem do mapa | Desconexão e listeners removidos | Planejado |
| NEXT-10 | WebSocket desconectado | Estado/aviso de conectividade | Planejado |
| NEXT-11 | Variáveis NEST_API_URL ausentes | Erro controlado sem URL undefined | Planejado |
| NEXT-12 | Validação TypeScript/Next build | Bundle gerado com dependências instaladas | Planejado |

## Execução e evidências
```bash
npm ci && npm run build
```

Teste de unidade não substitui E2E. Para simulação distribuída, usar MongoDB/Kafka descartáveis e stubs de API; para frontend, testar socket com dados sintéticos. Guardar SHA, ambiente, entradas, retorno, logs sem segredo e resultado por ID. Casos P0 são bloqueantes até evidência explícita.
