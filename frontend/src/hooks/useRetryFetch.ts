import { useCallback, useEffect, useRef, useState } from "react";

export type FetchStatus = "loading" | "waking" | "error" | "ready";

/**
 * Fetches data with automatic retries. Render's free tier spins the backend
 * down after inactivity, so the first request after idle time can fail or
 * hang while it cold-starts. This retries a few times with a delay instead
 * of immediately showing an empty/error state, and exposes a "waking"
 * status so the UI can explain what's happening rather than looking broken.
 */
export function useRetryFetch<T>(fetcher: () => Promise<T>, deps: unknown[], initial: T) {
  const [data, setData] = useState<T>(initial);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async () => {
    const maxRetries = 5;
    const delayMs = 4000;
    setStatus("loading");

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fetcherRef.current();
        setData(result);
        setStatus("ready");
        return;
      } catch {
        if (attempt === 0) setStatus("waking");
        if (attempt === maxRetries) {
          setStatus("error");
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, status, retry: load };
}
