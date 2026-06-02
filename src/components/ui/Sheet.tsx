import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../../lib/util";

/**
 * A mobile bottom sheet built on <dialog> (so focus-trapping, Esc, and the
 * top-layer come for free). Slides up from the bottom; closes on Esc, on a
 * backdrop tap, or via a caller-provided button in the thumb zone.
 */
export function Sheet({
  open,
  onClose,
  ariaLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={ariaLabel}
      onClose={onClose}
      onClick={(e) => {
        // Tap on the backdrop (the dialog element itself) closes it.
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "top-auto bottom-0 m-0 mx-auto w-full max-w-xl rounded-t-3xl",
        "max-h-[88vh] overflow-hidden border-2 border-line bg-surface p-0 text-ink",
        "shadow-2xl backdrop:bg-black/70",
        "animate-[sheet-up_0.28s_cubic-bezier(.2,.8,.2,1)] backdrop:animate-[backdrop-in_0.25s_ease]",
      )}
    >
      <div className="pb-safe flex max-h-[88vh] flex-col">
        {/* Grab handle affordance */}
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <span
            aria-hidden="true"
            className="h-1.5 w-12 rounded-full bg-line"
          />
        </div>
        <div className="overflow-auto">{children}</div>
      </div>
    </dialog>
  );
}
