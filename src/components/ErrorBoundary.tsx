import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary global. Captura errores de render no manejados en el árbol
 * de componentes y muestra un fallback minimal con paleta Lumière. Se
 * monta en el `RootLayout` alrededor del `<Outlet>` para no perder el
 * `<Toaster>` ni el `<CartDrawer>` si algo explota en una page.
 *
 * Decisión: el botón "Recargar" hace un full reload (`window.location.reload`)
 * en vez de intentar `setState({ hasError: false })` porque, si el error
 * vino de un módulo que rompió su propio estado (zustand store corrupto,
 * cache de react-query inconsistente), el remount no alcanza para
 * recuperar — el reload sí.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-card border border-border rounded-md p-6 lg:p-8 text-center space-y-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10">
            <AlertCircle size={26} className="text-destructive" />
          </div>
          <div>
            <h1
              className="text-2xl mb-2"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              Algo salió mal
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tuvimos un problema inesperado al mostrar esta página. Si el
              problema persiste, intentá más tarde.
            </p>
            {this.state.error?.message && (
              <p className="text-xs text-muted-foreground/70 mt-3 italic break-words">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Recargar
          </button>
        </div>
      </main>
    );
  }
}
