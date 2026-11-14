import { demoRoutesEnabled } from "../../utils/server-routes";
import AdminMapClient from "./AdminMapClient";

// A visualização global é apenas um demo local; nunca publicar sem identidade/ACL.
export const dynamic = "force-dynamic";

export default function AdminPage() {
  if (!demoRoutesEnabled()) {
    return (
      <p role="alert" className="p-6 text-contrast">
        Painel administrativo indisponível: autenticação por usuário ainda não homologada.
      </p>
    );
  }
  return <AdminMapClient />;
}
