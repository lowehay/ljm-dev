"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  hour: "numeric",
  minute: "2-digit",
});

// Shows the current time in the Philippines; rendered client-side only so the static page never shows a stale time
export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      South Cotabato, PH
      {time && (
        <>
          {" · "}
          <time className="text-fg-soft">{time}</time> (UTC+8)
        </>
      )}
    </span>
  );
}
