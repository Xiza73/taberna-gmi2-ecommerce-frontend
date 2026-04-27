import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { ForgotPasswordForm } from '@/features/auth';

export function ForgotPasswordPage() {
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);

  if (sentToEmail) {
    return (
      <div>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
          <CheckCircle2 size={26} className="text-primary" />
        </div>
        <h2
          className="text-3xl mb-2"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Revisá tu correo
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-1">
          Si <span className="text-foreground">{sentToEmail}</span> está
          registrado en Lumière, te enviamos un link para reestablecer tu
          contraseña.
        </p>
        <p className="text-xs text-muted-foreground/80 mb-8">
          El link es válido por 1 hora. Revisá también tu carpeta de spam.
        </p>

        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowLeft size={14} />
          Volver al inicio de sesión
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
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-sm text-muted-foreground">
          Ingresá tu email y te mandamos un link para crear una nueva.
        </p>
      </header>

      <ForgotPasswordForm onSent={setSentToEmail} />

      <p className="mt-6 text-sm text-muted-foreground text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-primary hover:underline underline-offset-4"
        >
          <ArrowLeft size={14} />
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}
