"use client"

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      An error occurred : {error.message}
      <button onClick={() => reset()}>Retry</button>
    </div>
  );
}
