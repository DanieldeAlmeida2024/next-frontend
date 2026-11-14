> **Modelo histórico de 11/11/2026.** O backend NestJS agora exige credencial privada; os testes e requisitos vigentes estão em `docs/ARQUITETURA.md`, `docs/PLANO_TESTES.md` e no README atual. Não usar este modelo antigo como evidência de deploy ou autenticação de usuários.

# UML — Frontend Next.js de rotas, mapas e rastreamento

**Documento v1.0.0**, 11/11/2026, base `11a4c17269eac032ecdd0ff113cdcedb6137f827`. Testes propostos não foram executados neste PR.

[Componentes](01_componentes.puml) · [Sequência crítica](02_sequencia.puml).

- [03 — Validação de rotas, segredo privado do Next e limites da demonstração](03_validacao_rotas_nest.puml) — diagrama atualizado com a implementação da `main`, sem fingir identidade ou ACL de usuário.
