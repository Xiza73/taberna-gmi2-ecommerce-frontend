import { useState } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { buildLoginSearch, ResetPasswordForm } from '@/features/auth';

function parseToken(searchStr: string): string | null {
  const params = new URLSearchParams(searchStr);
  const token = params.get('token');
  // El back genera tokens como `${customerId}.${rawUuid}` — chequeo mínimo
  // para descartar query strings vacíos o malformados.
  if (!token || token.length < 20) return null;
  return token;
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token] = useState(() => parseToken(location.searchStr));

  function handleSuccess() {
    toast.success('Contraseña actualizada. Iniciá sesión con la nueva.');
    void navigate({ to: '/login', search: buildLoginSearch() });
  }

  if (!token) {
    return (
      <div>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-6">
          <AlertTriangle size={26} className="text-destructive" />
        </div>
        <h2
          className="text-3xl mb-2"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Link inválido
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          Este link no es válido o ya expiró. Pedí uno nuevo y te llegará por
          email.
        </p>

        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:underline underline-offset-4"
        >
          Solicitar nuevo link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h2
          className="text-3xl mb-2"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Nueva contraseña
        </h2>
        <p className="text-sm text-muted-foreground">
          Elegí una contraseña nueva para tu cuenta de Lumière.
        </p>
      </header>

      <ResetPasswordForm token={token} onSuccess={handleSuccess} />
    </div>
  );
}
