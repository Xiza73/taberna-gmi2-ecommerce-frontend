import { useEffect, useState } from 'react';
import { Check, MapPin, Plus, Store, Truck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal, ModalContent } from '@/components/ui/Modal';
import { AddressForm, useAddresses } from '@/features/addresses';
import type { Address } from '@/types/address';
import type { ShippingMethod } from '@/types/order';
import { cn } from '@/utils/cn';
import { formatPEN } from '@/utils/format';
import {
  SHIPPING_METHOD_DESCRIPTIONS,
  SHIPPING_METHOD_LABELS,
} from '../lib/labels';
import { resolveShippingCost } from '../lib/shipping';
import { useCheckoutStore } from '../store/checkoutStore';

const PICKUP_INFO =
  import.meta.env.VITE_PICKUP_ADDRESS?.replace(/\\n/g, '\n') ??
  'Configura VITE_PICKUP_ADDRESS en .env';

const SHIPPING_OPTIONS: Array<{
  value: ShippingMethod;
  icon: typeof Truck;
}> = [
  { value: 'standard', icon: Truck },
  { value: 'express', icon: Zap },
  { value: 'pickup', icon: Store },
];

interface Props {
  onContinue: () => void;
}

export function Step1Shipping({ onContinue }: Props) {
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const setShippingMethod = useCheckoutStore((s) => s.setShippingMethod);
  const addressId = useCheckoutStore((s) => s.addressId);
  const setAddressId = useCheckoutStore((s) => s.setAddressId);

  const { data: addresses = [], isLoading } = useAddresses();
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Pre-seleccionar la default address (o la primera) cuando cargan.
  useEffect(() => {
    if (addressId !== null) return;
    if (addresses.length === 0) return;
    const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (defaultAddr) setAddressId(defaultAddr.id);
  }, [addresses, addressId, setAddressId]);

  function openCreate() {
    setEditingAddress(null);
    setIsFormOpen(true);
  }

  function openEdit(address: Address) {
    setEditingAddress(address);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setTimeout(() => setEditingAddress(null), 200);
  }

  const canContinue = Boolean(addressId);

  return (
    <section className="space-y-6">
      {/* Method cards */}
      <div>
        <h2
          className="text-lg mb-3"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Método de envío
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SHIPPING_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const cost = resolveShippingCost(opt.value);
            const selected = shippingMethod === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setShippingMethod(opt.value)}
                aria-pressed={selected}
                className={cn(
                  'text-left rounded-md border p-4 transition-colors',
                  selected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-foreground/30',
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={18} className={selected ? 'text-primary' : 'text-foreground/70'} />
                  {selected && (
                    <Check size={14} className="text-primary" />
                  )}
                </div>
                <p className="text-sm" style={{ fontWeight: 500 }}>
                  {SHIPPING_METHOD_LABELS[opt.value]}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {SHIPPING_METHOD_DESCRIPTIONS[opt.value]}
                </p>
                <p
                  className="text-sm tabular-nums mt-2"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
                >
                  {cost === 0 ? 'Gratis' : formatPEN(cost)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pickup info */}
      {shippingMethod === 'pickup' && (
        <div className="rounded-md border border-border bg-secondary/40 p-4 flex gap-3">
          <Store size={18} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm" style={{ fontWeight: 500 }}>
              Retirá en nuestra tienda
            </p>
            <p className="text-xs text-muted-foreground whitespace-pre-line mt-1 leading-relaxed">
              {PICKUP_INFO}
            </p>
            <p className="text-xs text-muted-foreground/80 mt-2">
              Te avisaremos por email cuando tu pedido esté listo.
            </p>
          </div>
        </div>
      )}

      {/* Address selector */}
      <div>
        <header className="flex items-baseline justify-between mb-3">
          <h2
            className="text-lg"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            {shippingMethod === 'pickup' ? 'Datos de contacto' : 'Dirección de envío'}
          </h2>
          {addresses.length > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={openCreate}>
              <Plus size={14} />
              Nueva
            </Button>
          )}
        </header>

        {shippingMethod === 'pickup' && (
          <p className="text-xs text-muted-foreground mb-3">
            Como elegiste recoger en tienda, no enviamos a esta dirección — la
            usamos para tu boleta y contacto.
          </p>
        )}

        {isLoading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-32 bg-muted rounded-md" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-md border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-primary" />
              <p className="text-sm" style={{ fontWeight: 500 }}>
                Agregá tu primera dirección
              </p>
            </div>
            <AddressForm
              onSuccess={() => {
                /* useAddresses invalidates; el effect autoselecciona la nueva */
              }}
              onCancel={() => {
                /* no hay nada que cancelar — el form es la única opción */
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {addresses.map((address) => (
              <AddressCardSelectable
                key={address.id}
                address={address}
                selected={addressId === address.id}
                onSelect={() => setAddressId(address.id)}
                onEdit={() => openEdit(address)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          size="lg"
          onClick={onContinue}
          disabled={!canContinue}
        >
          Continuar al pago
        </Button>
      </div>

      <Modal open={isFormOpen} onOpenChange={(open) => (open ? null : closeForm())}>
        <ModalContent
          title={editingAddress ? 'Editar dirección' : 'Nueva dirección'}
          maxWidth="max-w-2xl"
        >
          <AddressForm
            address={editingAddress ?? undefined}
            onSuccess={closeForm}
            onCancel={closeForm}
          />
        </ModalContent>
      </Modal>
    </section>
  );
}

function AddressCardSelectable({
  address,
  selected,
  onSelect,
  onEdit,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      role="radio"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-checked={selected}
      className={cn(
        'rounded-md border p-4 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card hover:border-foreground/30',
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin
            size={14}
            className={selected ? 'text-primary shrink-0' : 'text-foreground/50 shrink-0'}
          />
          <span className="text-sm truncate" style={{ fontWeight: 500 }}>
            {address.label}
          </span>
          {address.isDefault && (
            <span className="px-1.5 py-0.5 text-[9px] rounded-sm bg-primary/10 text-primary uppercase tracking-wider">
              Default
            </span>
          )}
        </div>
        {selected && <Check size={14} className="text-primary shrink-0" />}
      </div>
      <AddressCardBody address={address} />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="text-xs text-muted-foreground hover:text-foreground inline-block mt-2 underline-offset-2 hover:underline"
      >
        Editar
      </button>
    </div>
  );
}

function AddressCardBody({ address }: { address: Address }) {
  return (
    <div className="text-xs text-foreground/70 space-y-0.5">
      <p style={{ fontWeight: 500 }} className="text-foreground">
        {address.recipientName}
      </p>
      <p>{address.phone}</p>
      <p>{address.street}</p>
      <p className="text-muted-foreground">
        {address.district}, {address.city}, {address.department}
      </p>
    </div>
  );
}
