"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export default function LoginTracker() {
  const { isSignedIn, user } = useUser();
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    // Only track once per user session
    if (isSignedIn && user?.id && trackedRef.current !== user.id) {
      trackedRef.current = user.id;
      
      fetch("/api/track-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).catch(() => {
        // Silently fail
      });
    }
  }, [isSignedIn, user?.id]);

  return null;
}
