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

## Documentação técnica específica

[Projeto](docs/projeto/ESPECIFICACAO.md) · [UML](docs/uml/README.md) · [Testes](docs/testes/PLANO_DE_TESTES.md) · [Versionamento](docs/controle/VERSIONAMENTO.md)

## Validação de rotas e API NestJS (NEXT-ROUTES v1.1.0 proposta)

FormData de rotas e Place IDs, parâmetros de busca e resposta de Directions passam por validação tipada. GET `/api/routes/[routeId]` informa 400/404/502/503 e não mantém cache compartilhado de detalhes. Falhas upstream não produzem sucesso falso em ações POST; removida Server Action `.tsx` duplicada. CI usa `node:test`, TypeScript e inspeções Python, **sem API real nem deploy**. [Especificação](docs/projeto/CONTRATO_ROTAS_INPUT.md), [testes](docs/testes/ROTAS_VALIDADAS.md), [UML](docs/uml/03_validacao_rotas_nest.puml) e [versionamento](docs/controle/VERSIONAMENTO.md). **Autorização de rotas ainda precisa ser integrada no NestJS antes de produção.**
