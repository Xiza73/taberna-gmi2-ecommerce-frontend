import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { ApiError } from '@/api/errors';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

interface Props {
  onSuccess: () => void;
  /** Texto opcional debajo del botón mientras la mutation corre. */
  loadingLabel?: string;
}

/**
 * Botón oficial de "Sign in with Google" — se oculta automáticamente si
 * `VITE_GOOGLE_CLIENT_ID` no está configurado. La lib `<GoogleLogin>` carga
 * el script GIS de Google y renderiza el botón con branding oficial.
 *
 * Si Google Cloud Console no tiene `http://localhost:5175` (o el dominio de
 * prod) en "Authorized JavaScript origins", la inicialización del script
 * falla silenciosamente en consola — el usuario no verá el botón funcionar.
 */
export function GoogleSignInButton({ onSuccess, loadingLabel }: Props) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const { mutateAsync, isPending } = useGoogleSignIn();
  const [error, setError] = useState<string | null>(null);

  if (!clientId) return null;

  async function handleCredential(idToken: string) {
    setError(null);
    try {
      await mutateAsync(idToken);
      onSuccess();
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'No se pudo iniciar sesión con Google. Intentá de nuevo.';
      setError(msg);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(res) => {
            if (res.credential) {
              void handleCredential(res.credential);
            } else {
              setError('Google no devolvió credenciales. Reintentá.');
            }
          }}
          onError={() => {
            setError('No se pudo iniciar sesión con Google. Reintentá.');
          }}
          useOneTap={false}
          text="continue_with"
          shape="rectangular"
          theme="outline"
          size="large"
          width="320"
        />
      </div>

      {isPending && loadingLabel && (
        <p className="text-xs text-muted-foreground text-center">{loadingLabel}</p>
      )}

      {error && (
        <p
          role="alert"
          className="text-xs text-destructive text-center"
        >
          {error}
        </p>
      )}
    </div>
  );
}
