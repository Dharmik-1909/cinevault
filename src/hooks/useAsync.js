import { useEffect, useState } from 'react';

/** Run an async function (receives an AbortSignal) and track loading / error / data. */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ data: s.data, loading: true, error: null }));
    fn(ctrl.signal)
      .then((data) => {
        if (!ctrl.signal.aborted) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (error.name === 'AbortError' || ctrl.signal.aborted) return;
        setState({ data: null, loading: false, error });
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { ...state, retry: () => setNonce((n) => n + 1) };
}
