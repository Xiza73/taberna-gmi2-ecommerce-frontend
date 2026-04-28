import { useState } from 'react';
import { toast } from 'sonner';
import { MapPin, Plus } from 'lucide-react';
import {
  AddressCard,
  AddressForm,
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/features/addresses';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal, ModalContent } from '@/components/ui/Modal';
import { ApiError } from '@/api/errors';
import type { Address } from '@/types/address';

const MAX_ADDRESSES = 10;

export function AccountAddressesPage() {
  const { data, isLoading, isError, error } = useAddresses();
  const setDefault = useSetDefaultAddress();
  const remove = useDeleteAddress();

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDeleteFor, setConfirmDeleteFor] = useState<Address | null>(null);

  const addresses = data ?? [];
  const isAtLimit = addresses.length >= MAX_ADDRESSES;
  const isMutating = setDefault.isPending || remove.isPending;

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
    // Pequeño delay para evitar el flash de "modo crear" mientras cierra
    setTimeout(() => setEditingAddress(null), 200);
  }

  async function handleSetDefault(address: Address) {
    try {
      await setDefault.mutateAsync(address.id);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo marcar');
    }
  }

  async function handleConfirmDelete() {
    if (!confirmDeleteFor) return;
    try {
      await remove.mutateAsync(confirmDeleteFor.id);
      toast.success('Dirección eliminada');
      setConfirmDeleteFor(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo eliminar');
    }
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl mb-1" style={{ fontWeight: 500 }}>
            Mis direcciones
          </h2>
          <p className="text-sm text-muted-foreground">
            Administrá tus direcciones de envío. Hasta {MAX_ADDRESSES} permitidas.
          </p>
        </div>
        <Button
          size="md"
          onClick={openCreate}
          disabled={isAtLimit}
          aria-label="Agregar nueva dirección"
        >
          <Plus size={16} />
          Agregar
        </Button>
      </header>

      {isAtLimit && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700">
          Llegaste al máximo de {MAX_ADDRESSES} direcciones. Eliminá alguna para
          agregar otra.
        </div>
      )}

      {isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            No se pudieron cargar tus direcciones.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
      ) : isLoading ? (
        <ListSkeleton />
      ) : addresses.length === 0 ? (
        <EmptyState onAdd={openCreate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={openEdit}
              onDelete={(a) => setConfirmDeleteFor(a)}
              onSetDefault={(a) => void handleSetDefault(a)}
              isMutating={isMutating}
            />
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal open={isFormOpen} onOpenChange={(open) => (open ? null : closeForm())}>
        <ModalContent
          title={editingAddress ? 'Editar dirección' : 'Nueva dirección'}
          maxWidth="max-w-2xl"
        >
          <AddressForm
            address={editingAddress ?? undefined}
            onSuccess={() => {
              toast.success(
                editingAddress ? 'Dirección actualizada' : 'Dirección creada',
              );
              closeForm();
            }}
            onCancel={closeForm}
          />
        </ModalContent>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={confirmDeleteFor !== null}
        onOpenChange={(open) => !open && setConfirmDeleteFor(null)}
        title="¿Eliminar dirección?"
        message={
          confirmDeleteFor
            ? `Vas a eliminar "${confirmDeleteFor.label}" (${confirmDeleteFor.recipientName}). Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onConfirm={() => void handleConfirmDelete()}
        isPending={remove.isPending}
      />
    </section>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-md border border-border bg-card/50 p-10 text-center space-y-3">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
        <MapPin size={20} className="text-muted-foreground" />
      </div>
      <p className="text-base" style={{ fontWeight: 500 }}>
        Aún no tenés direcciones
      </p>
      <p className="text-sm text-muted-foreground">
        Agregá tu primera dirección para comprar más rápido.
      </p>
      <div className="pt-2">
        <Button onClick={onAdd} size="md">
          <Plus size={16} />
          Agregar dirección
        </Button>
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="h-44 bg-card border border-border rounded-md animate-pulse"
        />
      ))}
    </div>
  );
}
