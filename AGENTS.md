# Contexto de projeto — next-frontend

Interface Next.js para rotas, motoristas e visualização de localização no laboratório de rastreamento.

Antes de qualquer alteração: ler `src/app/, src/hooks/, src/utils/, package.json`, README, requisitos e configuração do projeto.

- Preservar tecnologias e contratos existentes (Next.js, TypeScript, React e Google Maps).
- Não alterar versões de dependências sem testes de compatibilidade.
- Nunca comitar segredos, .env, node_modules, dist ou dados sensíveis.
- Separar interface, regras e integrações. Preferir nomenclatura em português em novas abstrações sem quebrar APIs.
- Conferir npm run build antes de alegar funcionamento.
- Diagramas adicionados são referenciais; validar contra código.

**Risco:** O README antigo chamava o frontend de Golang, mas o código é Next.js. Integração depende de backend, Google Maps e variáveis .env.
