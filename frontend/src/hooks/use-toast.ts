"use client";

import { useEffect, useState } from "react";

export function useToast(duration = 2500) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timeoutId = window.setTimeout(() => setMessage(null), duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration, message]);

  return {
    message,
    showToast: setMessage,
    clearToast: () => setMessage(null),
  };
}
