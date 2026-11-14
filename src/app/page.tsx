import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-contrast">
      <div className="max-w-3xl w-full space-y-8">
        <p className="text-sm uppercase tracking-widest text-secondary">
          Laboratório de arquitetura orientada a eventos
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Rotas, motoristas e rastreamento em tempo real
        </h1>
        <p className="text-lg">
          Esta interface Next.js faz parte do projeto de rastreamento da Imersão
          Fullcycle. Crie uma rota, inicie a simulação e acompanhe posições no mapa
          quando o backend e o Google Maps estiverem configurados.
        </p>
        <nav aria-label="Ações do laboratório" className="flex flex-wrap gap-4">
          <Link
            href="/new-route"
            className="inline-flex items-center rounded-lg bg-main px-6 py-3 font-semibold text-primary"
          >
            Criar uma rota
          </Link>
          <Link
            href="/driver"
            className="inline-flex items-center rounded-lg border border-contrast px-6 py-3 font-semibold"
          >
            Iniciar simulação
          </Link>
        </nav>
        <p className="text-sm text-secondary">
          Projeto demonstrativo. Mapas e notificações exigem infraestrutura externa.
          A área administrativa ainda precisa de controle de acesso antes de uma
          disponibilização pública.
        </p>
      </div>
    </main>
  );
}
