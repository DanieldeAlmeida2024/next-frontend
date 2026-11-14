# Interface de Rastreamento de Veículos — Next.js

Frontend web do sistema de rastreamento de veículos da Imersão Full Cycle, com criação de rotas, consulta de mapas, painel do motorista e visualização de posições. Integra-se à [API NestJS](../nestjs-api) e utiliza serviços do Google Maps.

## Tecnologias

Next.js 15.5.29 · React 19.3.1 · TypeScript · Tailwind CSS · Socket.IO Client · Google Maps.

## Executar

Requer Node.js 22+ e npm. Configure variáveis do ambiente local:

```bash
cp .env.example .env.local
npm ci
npm run dev
```

No PowerShell, utilize `Copy-Item .env.example .env.local`. Não versione `.env.local`.

| Variável | Utilização |
| --- | --- |
| `NEST_API_URL` | Server Actions, chamadas server-side e proxy |
| `NEXT_PUBLIC_NEST_API_URL` | Socket.IO no navegador |
| `NEXT_PUBLIC_NEXT_API_URL` | API do frontend |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript no navegador |

A chave pública do Google Maps deve ter restrições de domínio e APIs no Google Cloud Console.

## Páginas e funcionalidades

- `/new-route`: busca origem/destino e solicita criação de rotas.
- `/driver`: consulta rotas, inicia o fluxo de viagem e acompanha posições.
- `/admin`: mapa de posições em tempo real para demonstração de monitoramento.
- `/api/routes/[routeId]`: proxy server-side para detalhes da rota.

O frontend não implementa autenticação de administrador completa. A autorização de ações e de dados por usuário deve ser garantida pelo backend antes de uso com usuários reais.

## Qualidade

```bash
npm ci
npm audit --audit-level=high
npm run lint
npm run build
```

O workflow `.github/workflows/security-build.yml` verifica auditoria de dependências, lint e build. Integração E2E com mapas, broker e backend depende do ambiente completo de laboratório e não é inferida do resultado de build.

## Projeto completo

[Orquestração e arquitetura](../Sistema-de-rastreamento-de-veiculos---Curso-Full-Cycle-2.0-) · [Backend NestJS](../nestjs-api) · [Simulador Go](../golang-simulator) · [Mensageria Kafka](../kafka).

[Requisitos](docs/REQUISITOS.md) · [Arquitetura](docs/ARQUITETURA.md) · [UML](docs/UML.puml) · [Plano de testes](docs/PLANO_TESTES.md).

## Integração segura do laboratório com NestJS

O NestJS exige a credencial privada `ROUTES_API_KEY` (mínimo 32 caracteres) no cabeçalho `x-routes-api-key` para operações em `/routes`. O Next.js agora envia essa chave **somente no servidor** em consultas, criação e início de rotas. Ela não deve ser definida com prefixo `NEXT_PUBLIC_` nem enviada a componentes React client-side.

Como ainda não existe autenticação individual de operadores no frontend, as rotas demonstrativas ficam **desabilitadas por padrão**. Para o **ambiente local isolado**, configure `ALLOW_UNAUTHENTICATED_ROUTE_DEMO=true` no servidor Next.js, com as portas expostas somente em `127.0.0.1`. A API retorna 403 fora dessa modalidade. Isso **não** é autorização adequada para publicar o painel na internet.

Os formulários rejeitam IDs inválidos antes de chamar o backend, as buscas de locais utilizam parâmetros de URL codificados e o proxy não registra corpos de resposta de falhas ou aplica cache compartilhado. A busca Google Maps e o Socket.IO permanecem dependentes do backend e de suas próprias políticas de autenticação e limitação.

Os testes usam `npm test` (Node.js 22, sem rede) e o pipeline mantém lint, auditoria de dependências e build.
