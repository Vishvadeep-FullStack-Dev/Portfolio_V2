'use client';

import { Toaster, toast } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster position="bottom-right" richColors closeButton />
  );
}

export { toast };
export default ToastProvider;
