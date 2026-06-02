import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../../lib/util";
import { Icon } from "./Icon";

/** Lock background scrolling (incl. iOS) while a sheet is open. */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const { body } = document;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}

/**
 * A mobile bottom sheet built on <dialog> (focus-trapping, Esc, and the
 * top-layer come for free). Slides up; the background is fully scroll-locked.
 * A sticky header keeps the grab handle + close button reachable while the
 * content scrolls inside the sheet.
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
  useScrollLock(open);

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
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "top-auto bottom-0 m-0 mx-auto h-auto max-h-[92svh] w-full max-w-xl",
        "overflow-hidden rounded-t-3xl border-2 border-line bg-surface p-0 text-ink shadow-2xl",
        "backdrop:bg-black/75 backdrop:backdrop-blur-sm",
        "animate-[sheet-up_0.3s_cubic-bezier(.2,.8,.2,1)] backdrop:animate-[backdrop-in_0.25s_ease]",
      )}
    >
      <div className="pb-safe flex max-h-[92svh] flex-col">
        {/* Sticky header: grab handle + always-reachable close. */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-line bg-surface/95 px-3 py-2 backdrop-blur">
          <span aria-hidden="true" className="ml-2 h-1.5 w-12 rounded-full bg-line" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-11 place-items-center rounded-full border-2 border-line bg-surface text-xl text-ink hover:border-brand"
          >
            <Icon name="close" className="size-6" />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </dialog>
  );
}
