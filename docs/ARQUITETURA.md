# Arquitetura — rastreamento de rotas (frontend)

Versão 1.1.0 · 14/11/2026

## Componentes

- **App Router do Next.js 15** (`src/app/`): páginas `/admin`, `/driver`, `/new-route` e proxy API `/api/routes/[routeId]`.
- **Server Actions** (`src/app/driver/start-route.action.ts`, `src/app/new-route/create-route.action.ts`): consultas e operações de criação/início via NestJS. Exigem proteção de autenticação/autorização antes de qualquer publicação.
- **Hook Google Maps** (`src/hooks/useMap.ts`): inicializa Maps JavaScript com componente DOM disponível; tipo React 19 `RefObject<T|null>` foi corrigido.
- **Mapas cliente** (`MapDriver`, `MapNewRoute`, `src/utils/map.ts`): exibem rotas e coordenadas usando Google Maps JS.
- **Socket.IO Client** (`src/utils/socket-io.ts`): recebe atualizações de posições do backend por canal em tempo real.
- **Backend NestJS**: serviço externo, configurado via `NEST_API_URL` no servidor e `NEXT_PUBLIC_NEST_API_URL` no navegador.

O `/driver` usa `dynamic = 'force-dynamic'` para não consultar o backend durante o `next build` e exibe aviso quando o NestJS está indisponível. As páginas não são artefatos totalmente estáticos e dependem de infraestrutura externa para funções completas.

## Segurança e dependências

- Next 15.5.29/React 19.3.1 estável; lockfile regenerado em runner npm, inclusive dependências transitivas.
- Override direcionado de `postcss`, `brace-expansion` e `decode-uri-component`, com auditoria alta/crítica obrigatória.
- Cabeçalhos `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` e `Permissions-Policy` via `next.config.ts`.
- `npm run lint` executa ESLint local via `scripts/lint.cjs` no CI; `next build` omite o lint duplicado, mas **não** substitui o gate separado.
- Chaves `NEXT_PUBLIC_*` ficam visíveis ao navegador; a chave Google Maps precisa de restrição por referrer e API.

## Limites de confiabilidade

Não há autenticação ou autorização de administrador nesta camada; não promover o protótipo a serviço público sem esse controle. Não existem testes E2E contra NestJS, Kafka, Google Maps reais nem garantias de atualização em tempo real em ambiente publicado. O frontend não deve exibir informações de localização pessoal sem base legal, controles de acesso e retenção adequados.
