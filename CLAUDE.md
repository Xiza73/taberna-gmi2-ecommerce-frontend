# Ecommerce Frontend — Storefront GMI2 (brand: Lumière)

> Este `CLAUDE.md` **extiende** las reglas compartidas en `../CLAUDE.md` (raíz del workspace)
> y `../docs/FRONTEND-CONVENTIONS.md` + `../docs/API-CONTRACT.md`. Leer primero la raíz.
> Acá sólo van overrides y cosas específicas del storefront.

> **Nombre técnico del repo / paquete**: `ecommerce-frontend`. **Brand visible al usuario
> final**: "Lumière" (ecommerce de moda/lifestyle, "estilo atemporal y calidad excepcional").
> El nombre técnico no cambia para mantener consistencia con `backoffice-frontend` /
> `pos-frontend`.

---

## Rol del frontend

Storefront público del ecommerce para **clientes finales** (customers, no staff).
Consume endpoints `/auth/*`, `/customers/*`, `/categories`, `/products`, `/cart`,
`/orders`, `/wishlist`, `/reviews`, `/addresses`, `/banners`, `/coupons` del back.

**Usuarios**: customer (no hay roles internos — todos los customers tienen el mismo
nivel de permisos).

---

## Scope MVP

- Auth customer (register/login email + Google) + forgot/reset password + me + logout
- Catálogo: home con banners, listado de productos con filtros/paginación, detalle
- Categorías como página
- Carrito (drawer + página) — agregar, modificar cantidad, eliminar, totales, aplicar cupón
- Checkout: addresses CRUD + método de envío + MercadoPago (Checkout Pro redirect) + crear orden
- Mi cuenta: mis órdenes (listado + detalle + cancel + retry-payment) + addresses + perfil + cambiar password
- Wishlist
- Reviews (escribir desde una orden entregada — la moderación la hace el backoffice)

**Fuera del MVP** (fase 2+): live search avanzada, comparador de productos, recomendaciones IA,
blog, multi-idioma, SSR.

**Fuera de scope siempre**: el panel de administración va en repo separado
(`backoffice-frontend/`). El POS también (`pos-frontend/`).

---

## Comandos del proyecto

```bash
pnpm dev               # Vite dev server con HMR (puerto 5175)
pnpm build             # tsc -b && vite build (producción)
pnpm preview           # Preview del build
pnpm test              # Vitest watch
pnpm test:ci           # Vitest run (CI)
pnpm lint              # ESLint
pnpm lint:fix          # ESLint --fix
pnpm format            # Prettier --write
pnpm typecheck         # tsc --noEmit
```

**Puerto del dev server**: 5175 (con `strictPort: true`). El backoffice está en 5174.
Eso permite correr ambos fronts a la vez sin colisiones.

---

## Scopes de Conventional Commits (específicos del ecommerce)

`auth`, `home`, `catalog`, `product`, `cart`, `checkout`, `orders`, `account`,
`addresses`, `wishlist`, `reviews`, `coupons`, `payments`, `ui`, `layout`,
`router`, `api`, `theme`.

Ejemplos:
- `feat(catalog): add category filter and sort dropdown`
- `feat(checkout): integrate MercadoPago Checkout Pro redirect`
- `fix(cart): persist cart state across page reloads`

---

## Layout & navegación

- `RootLayout` en `src/layouts/` — header (logo + nav + cart icon + user menu) + footer
- Rutas autenticadas (checkout, mi cuenta, wishlist) bajo guard que redirige a `/login`
- Login/register/home/catálogo/detalle producto son públicos

---

## Theming

- Tema dual light/dark en `src/styles/theme.css`. **Default: light** (paleta cálida
  tierra/coral del Figma de Lumière).
- `:root` = light (warm: bg `#fdfaf7`, fg `#1a1412`, primary `#c65d3b`, accent `#d97757`,
  font display `Cormorant Garamond` serif, font body `Outfit`).
- `.dark` = paleta oklch neutra (negros profundos), también del Figma. Se activa
  con `<html class="dark">`.
- Toggle dark/light se implementa más adelante con un store simple + `class` toggle
  en `<html>`. Por ahora `<html>` sin clase = light.
- Border radius pequeño (`0.25rem`), container max width 1400px (visto en Figma
  como `max-w-[1400px]`).

---

## Diseño visual

Mockups y código generado por Figma en `.claude/ui-design/` (gitignored — local only).
**Solo para referencia visual.** La lógica interna se moldea con TanStack + las libs
definidas en la raíz, no se copia el código del Figma tal cual.

---

## Integraciones externas específicas del ecommerce

- **MercadoPago Checkout Pro**: el back crea la preferencia y devuelve `paymentUrl`.
  El front hace `window.location.assign(paymentUrl)`. Cuando el customer vuelve, el
  back recibió el webhook y ya actualizó el estado de la orden. Ver
  `../docs/backend-mirror/modules/payments.md`.
- **Google Sign-In** (cliente): usamos el cliente JS de Google con `VITE_GOOGLE_CLIENT_ID`.
  El front obtiene `idToken` y lo manda a `/auth/google`. El back verifica.

---

## Variables de entorno

| Variable | Default dev | Notas |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | Base URL del backend |
| `VITE_GOOGLE_CLIENT_ID` | (sin default) | Client ID de Google OAuth (web) |
| `VITE_MP_PUBLIC_KEY` | (sin default) | Public key de MercadoPago (sandbox/prod) |

---

## Backend API reference

**No hay un `backend-api.md` mantenido a mano.** La fuente de verdad son los docs del back en:

- `../docs/backend-mirror/` (espejo refrescable)
- `../backend/docs/modules/` (siempre lo más fresco — `git pull` + skill `sync-backend-docs`)

Antes de implementar un endpoint nuevo: refrescar el mirror y leer `modules/<mod>.md`.

Endpoints customer-facing relevantes (sin prefijo `/admin`):
- `/auth/*`, `/customers/profile`, `/customers/change-password`
- `/categories`, `/categories/:slug` (públicos)
- `/products`, `/products/:slug`, `/products/featured` (mayormente públicos)
- `/cart`, `/cart/items`
- `/orders`, `/orders/:id`, `/orders/:id/cancel`, `/orders/:id/retry-payment`
- `/wishlist`, `/wishlist/items`
- `/reviews` (POST con orderId), `/reviews/product/:productId` (GET público)
- `/addresses`, `/addresses/:id`
- `/banners` (GET público)
- `/coupons/validate` (validar antes de checkout)

---

## Override del estilo de código

Hereda todo de `../CLAUDE.md` y `../docs/FRONTEND-CONVENTIONS.md`. Sin overrides al día de hoy.
