import { useEffect, useState } from "react";
import { subscribeToast, type ToastMessage } from "../../lib/toast";

const VISIBLE_MS = 2800;

export function ToastHost() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => subscribeToast(setToast), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    // Centered on screen so it's visible even with a narrow visual field.
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4"
    >
      <div className="max-w-[90%] rounded-xl2 border-2 border-on-brand/20 bg-brand px-8 py-5 text-center text-2xl font-bold text-on-brand shadow-2xl">
        {toast.text}
      </div>
    </div>
  );
}
