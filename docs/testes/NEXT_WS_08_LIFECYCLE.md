# NEXT-WS-08 — Painel demo e ciclo de vida dos listeners Socket.IO

14/11/2026 · Next.js de rastreamento Full Cycle.

## Falhas reais
- A rota /admin era Client Component exposto e tentava conectar ao socket de GPS independentemente de a demonstração sem autenticação estar habilitada.
- MapDriver adicionava listeners por rota a cada troca de seleção, sem remoção específica; socket.offAny() afetava inclusive listeners de outros componentes.
- Debug console.log('aaaaaa') e evento GPS aceito sem verificar route_id/coordenadas.

## Alterações
- A página /admin passa a ser Server Component com gate ALLOW_UNAUTHENTICATED_ROUTE_DEMO antes de renderizar o mapa Client; configuração padrão é negar.
- MapDriver remove somente o próprio listener ao trocar a rota e desmontar, e descarta respostas de fetch de seleções antigas.
- Rejeição de GPS com rota divergente, NaN/infinito e coordenadas fora dos limites da Terra.
- Testes de contrato Node e build Next.js verificam o comportamento estrutural.

## Bloqueios de produto
Isto não substitui autenticação de usuário nem ACL no NestJS. O PR de Socket.IO do backend e a emissão confiável de capability continuam dependentes. Não habilitar ALLOW_UNAUTHENTICATED_ROUTE_DEMO na Internet; nenhum deploy executado.
