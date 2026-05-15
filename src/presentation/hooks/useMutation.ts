import { useCallback, useState } from 'react';

export interface UseMutationResult<Input, Output> {
  run: (input: Input) => Promise<Output>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useMutation<Input, Output>(
  fn: (input: Input) => Promise<Output>,
): UseMutationResult<Input, Output> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(
    async (input: Input) => {
      setLoading(true);
      setError(null);
      try {
        return await fn(input);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { run, loading, error, reset };
}
