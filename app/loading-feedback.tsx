"use client";

import { useEffect, useState } from "react";

export default function LoadingFeedback({ label, className = "" }: { label: string; className?: string }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (seconds < 1) return null;
  return <div className={`loading-feedback ${className}`} role="status" aria-label={label}>
    <div className="loading-skeleton" aria-hidden="true"><span /><span /><span /></div>
    {seconds >= 10 && <div className="loading-detail">
      <progress aria-label={label} />
      <p>{label} — {seconds}s elapsed. Time remaining unavailable.</p>
    </div>}
  </div>;
}

export function PageLoading() {
  return <main className="loading-shell" aria-busy="true" aria-label="Loading portfolio">
    <LoadingFeedback label="Loading portfolio" className="page-skeleton" />
  </main>;
}
