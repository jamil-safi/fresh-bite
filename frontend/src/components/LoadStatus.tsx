import Icon from "./Icon";
import { FetchStatus } from "../hooks/useRetryFetch";

export default function LoadStatus({
  status,
  onRetry,
  label = "dishes",
}: {
  status: FetchStatus;
  onRetry: () => void;
  label?: string;
}) {
  if (status === "waking") {
    return (
      <div className="card mt-8 flex flex-col items-center gap-3 p-10 text-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary-container/30 border-t-primary" />
        <p className="font-bold">Waking up the kitchen…</p>
        <p className="max-w-sm text-sm text-on-surface-variant">
          Our server takes a little nap when it's quiet. Give it up to a minute to warm back up —
          this only happens on the first visit in a while.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="card mt-8 flex flex-col items-center gap-3 p-10 text-center">
        <Icon name="cloud_off" className="!text-4xl text-on-surface-variant" />
        <p className="font-bold">Couldn't reach the server</p>
        <p className="max-w-sm text-sm text-on-surface-variant">
          We tried a few times but couldn't load the {label}. Check your connection and try again.
        </p>
        <button onClick={onRetry} className="btn-primary !px-5 !py-2.5 text-sm">
          <Icon name="refresh" className="!text-base" /> Try Again
        </button>
      </div>
    );
  }

  return null;
}
