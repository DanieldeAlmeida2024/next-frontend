# next-frontend

Interface Next.js para rotas, motoristas e visualização de localização no laboratório de rastreamento.

## Tecnologias
Next.js, TypeScript, React e Google Maps.

## Execução (após configurar dependências)
```bash
npm ci && npm run dev
```

**Validação sugerida:** `npm run build`. Não foi realizada nesta revisão documental.

## Navegação
Arquivos de referência: `src/app/, src/hooks/, src/utils/, package.json`.

## Estado e riscos
O README antigo chamava o frontend de Golang, mas o código é Next.js. Integração depende de backend, Google Maps e variáveis .env.


## Status de segurança (13/11/2026) — pendência P0 aberta

A dependência direta `next@15.0.3` e o React em versão RC são antigos. **Este PR não os considera corrigidos**: o lockfile continua original, para não prometer um build de produção sem atualizar e executar as dependências. Foi adicionada a auditoria `npm audit --audit-level=high`, um workflow de compilação e o Dependabot semanal para propor mudanças sincronizadas de `package.json` + `package-lock.json`.

O `next.config.ts` agora define cabeçalhos `nosniff`, anti-frame e políticas de referrer/permissões. Esses cabeçalhos são defesa adicional, não resolvem CVEs de dependências nem autorização de rotas. **Não publicar** até atualização auditada (recomendação atual de manutenção: Next 15.5.29 ou superior da linha corrigida), teste de build, verificação de Google Maps e revisão do backend NestJS. As issues P0 permanecem abertas.

```bash
npm ci
npm audit --audit-level=high
npm run build
```

Após atualizar dependências, confirmar que o lockfile foi regenerado pelo npm e commitado junto com o manifesto. Não desabilitar o gate de auditoria para obter um falso verde.

## Guia técnico
- [Requisitos](docs/REQUISITOS.md)
- [Arquitetura](docs/ARQUITETURA.md)
- [UML](docs/UML.puml)
- [Plano de testes](docs/PLANO_TESTES.md)
- [Instruções para IA](AGENTS.md)

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
