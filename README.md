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

## Documentação técnica individual (v1.0.0)

- [Especificação do projeto](docs/projeto/ESPECIFICACAO.md)
- [Fontes UML](docs/uml/README.md)
- [Plano de testes](docs/testes/PLANO_DE_TESTES.md)
- [Versionamento](docs/controle/VERSIONAMENTO.md)
