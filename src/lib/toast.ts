export interface ToastMessage {
  id: number;
  text: string;
}

type Listener = (toast: ToastMessage) => void;

const listeners = new Set<Listener>();
let counter = 0;

/** Show a transient toast message from anywhere in the app. */
export function showToast(text: string): void {
  const toast: ToastMessage = { id: ++counter, text };
  listeners.forEach((l) => l(toast));
}

/** Subscribe to toast messages; returns an unsubscribe function. */
export function subscribeToast(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
