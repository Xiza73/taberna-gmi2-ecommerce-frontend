import { Check, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Address } from '@/types/address';
import { cn } from '@/utils/cn';

interface Props {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  isMutating?: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isMutating = false,
}: Props) {
  return (
    <article
      className={cn(
        'bg-card border rounded-md p-4 lg:p-5 space-y-3',
        address.isDefault ? 'border-primary/40' : 'border-border',
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin size={16} className="text-primary shrink-0" />
          <h3 className="text-sm truncate" style={{ fontWeight: 500 }}>
            {address.label}
          </h3>
          {address.isDefault && (
            <span className="px-2 py-0.5 text-[10px] tracking-wider uppercase rounded-sm bg-primary/10 text-primary">
              Predeterminada
            </span>
          )}
        </div>
      </header>

      <div className="text-sm text-foreground/80 space-y-0.5">
        <p style={{ fontWeight: 500 }}>{address.recipientName}</p>
        <p className="text-muted-foreground">{address.phone}</p>
        <p>{address.street}</p>
        <p className="text-muted-foreground">
          {address.district}, {address.city}, {address.department}
          {address.zipCode ? ` · ${address.zipCode}` : ''}
        </p>
        {address.reference && (
          <p className="text-xs text-muted-foreground italic mt-1">
            {address.reference}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {!address.isDefault && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(address)}
            disabled={isMutating}
          >
            <Check size={14} />
            Predeterminada
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(address)}
          disabled={isMutating}
        >
          <Pencil size={14} />
          Editar
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(address)}
          disabled={isMutating}
          className="text-destructive hover:bg-destructive/5"
        >
          <Trash2 size={14} />
          Eliminar
        </Button>
      </div>
    </article>
  );
}
