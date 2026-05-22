import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const useApi = (request, deps = [], options = {}) => {
  const [data, setData] = useState(options.initialData ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request();
      setData(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
      if (options.toastErrors !== false) toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
    // request is intentionally controlled by callers through deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run().catch(() => {});
  }, [run]);

  return { data, setData, loading, error, refetch: run };
};
