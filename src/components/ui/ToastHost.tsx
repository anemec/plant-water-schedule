import { useEffect, useState } from "react";
import { subscribeToast, type ToastMessage } from "../../lib/toast";

const VISIBLE_MS = 2600;

export function ToastHost() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    return subscribeToast((t) => setToast(t));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4"
      style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
    >
      <div className="max-w-[90%] rounded-2xl bg-brand-strong px-5 py-3 text-center text-base font-extrabold text-canvas shadow-lg shadow-black/40">
        {toast.text}
      </div>
    </div>
  );
}
