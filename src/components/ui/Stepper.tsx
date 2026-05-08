import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface StepperItem {
  /** ID estable, ej "shipping" */
  id: string;
  label: string;
}

interface Props {
  steps: StepperItem[];
  /** Index 0-based del step actualmente activo. */
  currentIndex: number;
  /** Click en un step previo (índice menor que el actual) para volver. */
  onStepClick?: (index: number) => void;
}

/**
 * Stepper visual horizontal: círculos numerados con líneas conectoras +
 * label debajo. Steps anteriores al actual se marcan como "completed"
 * (check); el actual queda destacado; los siguientes en muted.
 */
export function Stepper({ steps, currentIndex, onStepClick }: Props) {
  return (
    <ol className="flex items-start gap-1 sm:gap-3">
      {steps.map((step, idx) => {
        const isCurrent = idx === currentIndex;
        const isCompleted = idx < currentIndex;
        const isUpcoming = idx > currentIndex;
        const canClick = isCompleted && Boolean(onStepClick);

        const circleClass = cn(
          'relative shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors',
          isCompleted && 'bg-primary text-primary-foreground',
          isCurrent &&
            'bg-foreground text-background ring-4 ring-foreground/10',
          isUpcoming && 'bg-muted text-muted-foreground',
        );

        return (
          <li
            key={step.id}
            className="flex-1 flex flex-col items-center text-center min-w-0"
          >
            <div className="w-full flex items-center gap-1 sm:gap-2">
              <div className="flex-1 flex items-center">
                {idx > 0 && (
                  <span
                    className={cn(
                      'h-px flex-1 transition-colors',
                      idx <= currentIndex ? 'bg-foreground' : 'bg-border',
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
              {canClick ? (
                <button
                  type="button"
                  onClick={() => onStepClick?.(idx)}
                  className={cn(circleClass, 'cursor-pointer hover:opacity-80')}
                  aria-label={`Volver al paso ${idx + 1}: ${step.label}`}
                >
                  <Check size={14} />
                </button>
              ) : (
                <span className={circleClass} aria-current={isCurrent ? 'step' : undefined}>
                  {isCompleted ? <Check size={14} /> : idx + 1}
                </span>
              )}
              <div className="flex-1 flex items-center">
                {idx < steps.length - 1 && (
                  <span
                    className={cn(
                      'h-px flex-1 transition-colors',
                      idx < currentIndex ? 'bg-foreground' : 'bg-border',
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
            <span
              className={cn(
                'mt-2 text-[10px] sm:text-xs tracking-wide uppercase truncate w-full',
                isCurrent ? 'text-foreground' : 'text-muted-foreground',
              )}
              style={{ fontWeight: isCurrent ? 500 : 400 }}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
