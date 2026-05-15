import { useSeo } from '@/hooks/useSeo';
import { ChangePasswordForm, ProfileForm } from '@/features/account';

/**
 * Página /account/profile. Vive dentro del `AccountLayout` (header de
 * "Mi cuenta" + sidebar). Dos secciones independientes:
 *   1. Datos personales (name, phone, email read-only)
 *   2. Cambio de contraseña
 *
 * Mobile-first: stack vertical en mobile, dos columnas en lg+.
 */
export function AccountProfilePage() {
  const seo = useSeo({ title: 'Mi cuenta — Lumière', noIndex: true });

  return (
    <>
      {seo}
      <div className="space-y-8 lg:space-y-10">
        <section className="space-y-5">
          <header>
            <h2 className="text-xl mb-1" style={{ fontWeight: 500 }}>
              Datos personales
            </h2>
            <p className="text-sm text-muted-foreground">
              Actualizá tu nombre y teléfono. El email no se puede modificar.
            </p>
          </header>
          <div className="rounded-md border border-border bg-card p-5 lg:p-6">
            <ProfileForm />
          </div>
        </section>

        <section className="space-y-5">
          <header>
            <h2 className="text-xl mb-1" style={{ fontWeight: 500 }}>
              Cambiar contraseña
            </h2>
            <p className="text-sm text-muted-foreground">
              Por seguridad, ingresá tu contraseña actual para confirmar el
              cambio.
            </p>
          </header>
          <div className="rounded-md border border-border bg-card p-5 lg:p-6">
            <ChangePasswordForm />
          </div>
        </section>
      </div>
    </>
  );
}
