# Requisitos — frontend de rotas e rastreamento

Versão 1.1.0 · 14/11/2026

## Funcionais

- **RF01:** listar rotas recebidas do NestJS e permitir iniciar uma viagem.
- **RF02:** pesquisar origem/destino, visualizar trajeto e criar nova rota.
- **RF03:** exibir posição em tempo real recebida por Socket.IO.
- **RF04:** consultar detalhes de rota por `/api/routes/[routeId]`.
- **RF05:** sinalizar serviço de rotas indisponível em vez de falhar durante o build.
- **RF06 (pendente):** autenticação/autorização para telas e ações de administração.

## Não funcionais

- **RNF01:** Next.js 15.5.29 e React 19.3.1 com lockfile reproduzível.
- **RNF02:** CI obrigatória com `npm ci`, `npm audit --audit-level=high`, `npm run lint` e `npm run build`.
- **RNF03:** não armazenar segredo privado em `NEXT_PUBLIC_*`; restringir a chave Google Maps no provedor.
- **RNF04:** compatibilidade de tipos React 19 e páginas válidas no Next App Router.
- **RNF05:** cabeçalhos de segurança e configuração por ambiente.
- **RNF06 (pendente):** testes E2E, observabilidade, autenticação, gestão de sessões e segurança de localização.

Os requisitos pendentes são explicitamente não homologados; sucesso de compilação/CI não significa que mapas e tracking funcionem em produção.
