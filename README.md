# Rastreamento de rotas — frontend Next.js

Interface web do laboratório **Imersão Fullcycle 20**. Gerencia rotas, permite iniciar uma viagem e mostra pontos de posição em mapas Google. O repositório é o **frontend em Next.js/React**, não o simulador Go nem o serviço NestJS.

## Tecnologia e dependências

- **Next.js 15.5.29**, **React 19.3.1 estável**, TypeScript, Tailwind CSS e Socket.IO Client.
- Google Maps JavaScript, Directions, Places e utilitários de mapas.
- Backend NestJS e broker de eventos **externos a este frontend**.

A atualização de segurança substituiu Next 15.0.3/React RC por versões estáveis e regenerou **package.json + package-lock.json no npm**. O `npm audit --audit-level=high` e o build são gates obrigatórios do GitHub Actions. Permanecem avisos moderados em dependências transitivas de desenvolvimento; eles não foram ocultados com flags de ignore.

## Preparar e executar localmente

Requer Node 22+ e npm. Depois de clonar:

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Em Windows PowerShell, use `Copy-Item .env.example .env.local` no lugar do `cp`.

Ajuste os valores de `.env.local` conforme seu ambiente. O arquivo está ignorado pelo Git e não deve conter credenciais com acesso irrestrito. O Google Maps expõe a chave `NEXT_PUBLIC_...` ao navegador: **limite-a no Google Cloud Console por domínio/referrer e APIs autorizadas**.

| Variável | Usada por |
| --- | --- |
| `NEST_API_URL` | Server Actions, SSR de rotas e proxy API Next |
| `NEXT_PUBLIC_NEST_API_URL` | Conexão Socket.IO do navegador |
| `NEXT_PUBLIC_NEXT_API_URL` | Consultas das páginas de mapa à API do frontend |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript no navegador |

## Páginas e fluxo

- **`/new-route`**: pesquisa origem/destino no NestJS e cria rota; depende de Places/Directions.
- **`/driver`**: lista rotas e permite iniciar a viagem, com visualização geográfica e Socket.IO. Consulta o NestJS em tempo de requisição e exibe indisponibilidade quando o serviço não responde.
- **`/admin`**: mapa de posições em tempo real. Não há autenticação de administrador implementada neste frontend.
- **`/api/routes/[routeId]`**: proxy server-side para obter detalhes da rota.

**Limites:** telas são um protótipo de tracking, sem homologação E2E com Kafka, Mongo, NestJS e Google Maps reais. Não usar como painel público de controle sem autorização de usuários, tratamento de falhas de integração e testes de permissões; cabeçalhos HTTP de segurança não substituem autenticação.

## Verificação automática

```bash
npm ci
npm audit --audit-level=high
npm run lint
npm run build
```

O workflow `.github/workflows/security-build.yml` executa os quatro comandos. O lint roda explicitamente com ESLint local (suportando Windows/Linux), pois o wrapper legado do Next 15 não funciona de forma consistente com todas as configurações. O `next build` não duplica esse lint, mas o gate de CI permanece obrigatório.

**Não comprovado por esse pipeline:** conexão à API real, precisão do GPS/mapas, controle de acesso, testes end-to-end ou deploy. Uma build verde não significa que esses serviços externos estejam operacionais.

## Documentação

[Requisitos](docs/REQUISITOS.md) · [Arquitetura](docs/ARQUITETURA.md) · [Modelo UML](docs/UML.puml) · [Plano de testes](docs/PLANO_TESTES.md) · [Instruções para manutenção/IA](AGENTS.md).

---

## README histórico (algumas instruções podem estar desatualizadas)

# Imersão Fullcycle 20 - Sistema de rastreamento de veículos

## Descrição

Repositório do Golang (front-end da aplicação).

## Requerimentos

É necessário integrar com Google Maps, para isso, é necessário criar uma chave de API no Google Cloud Platform. Para isso, siga os passos:

1. Acesse o [Google Cloud Platform](https://cloud.google.com/).
2. Crie um novo projeto.
3. Ative a API do Places, Directions e Maps JavaScript do Google Maps.
4. Guarde a chave de API gerada.

## Rodar a aplicação

Levante o container:

```
docker compose up -d
```

Acesse o container do Next.js:

```
docker compose exec next bash
```

Gere o arquivo `.env` através do comando:

```
cp .env.example .env
```

Instale as dependências:

```bash
npm install
```

Rode o servidor:

```bash
npm run dev
```
