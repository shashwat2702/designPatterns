// Red flag solution

// if (api === "payments") retryWithBackoff();
// else if (api === "analytics") retryOnce();
// else failFast();

interface RetryStrategy {
  shouldRetry(error: unknown, attempt: number): boolean;
  getDelay(attempt: number): number;
}

class FailFastStrategy implements RetryStrategy {
  shouldRetry(): boolean {
    return false;
  }

  getDelay(): number {
    return 0;
  }
}

class FixedRetryStrategy implements RetryStrategy {
  constructor(private maxRetries = 2, private delayMs = 500) {}

  shouldRetry(_: unknown, attempt: number): boolean {
    return attempt < this.maxRetries;
  }

  getDelay(): number {
    return this.delayMs;
  }
}

class ExponentialBackoffStrategy implements RetryStrategy {
  constructor(
    private maxRetries = 5,
    private baseDelay = 300
  ) {}

  shouldRetry(_: unknown, attempt: number): boolean {
    return attempt < this.maxRetries;
  }

  getDelay(attempt: number): number {
    return this.baseDelay * Math.pow(2, attempt);
  }
}

class ApiClient {
  constructor(private retryStrategy: RetryStrategy) {}

  async request<T>(fn: () => Promise<T>): Promise<T> {
    let attempt = 0;

    while (true) {
      try {
        return await fn();
      } catch (error) {
        if (!this.retryStrategy.shouldRetry(error, attempt)) {
          throw error;
        }

        const delay = this.retryStrategy.getDelay(attempt);
        await new Promise(res => setTimeout(res, delay));
        attempt++;
      }
    }
  }
}

// Payments → must retry safely
const paymentsClient = new ApiClient(
  new ExponentialBackoffStrategy()
);

// Analytics → retry once
const analyticsClient = new ApiClient(
  new FixedRetryStrategy(1, 200)
);

// Auth → never retry
const authClient = new ApiClient(
  new FailFastStrategy()
);


// Building on top if it for the API client with retry and cancellation logic

function fetchWithRetry(url: string, strategy: RetryStrategy, signal: AbortSignal) {
    return async function execute() {
        let attempt = 0;

        while (true) {
            if(signal.aborted) {
                throw new DOMException('Aborted', 'AbortError');
            }

            try {
                const response = await fetch(url, { signal });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return await response.json();
            } catch (error) {
                if(signal.aborted) {
                    throw error;
                }
                if (!strategy.shouldRetry(error, attempt)) {
                    throw error;
                }
                const delay = strategy.getDelay(attempt);
                await new Promise((resolve, reject) => {
                    const timeoutId = setTimeout(resolve, delay);

                    signal.addEventListener('abort', () => {
                        clearTimeout(timeoutId);
                        reject(new DOMException('Aborted', 'AbortError'));
                    });
                });
                attempt++;
            }
        }
    }
}

// React based example
const useRef = <T,>(val: T) => {
    return { current: val } as { current: T };
}
// single global prevDeps ref used by this simple useEffect emulation
const prevDeps = useRef<any[] | undefined>(undefined);
const useEffect = (callback: () => void | (() => void), deps?: any[]) => {
    // If deps omitted, run every time (matches React behavior)
    if (deps === undefined) {
        callback();
        return;
    }

    const prev = prevDeps.current;
    let hasChanged = false;

    if (!prev) {
        // first run -> treat as change
        hasChanged = true;
    } else if (prev.length !== deps.length) {
        hasChanged = true;
    } else {
        hasChanged = deps.some((dep, i) => !Object.is(dep, prev[i]));
    }

    if (hasChanged) {
        // support optional cleanup return (ignored in this minimal shim)
        callback();
    }

    // store a shallow copy so future mutations of the original array don't break compare
    prevDeps.current = deps.slice();
};

function usePaymentsApi() {
  const abortRef = useRef<AbortController | null>(null);

  const execute = async () => {
    abortRef.current?.abort(); // cancel previous
    abortRef.current = new AbortController();

    const fetcher = fetchWithRetry(
        '/payments',
      new FixedRetryStrategy(3, 1000),
      abortRef.current.signal
    );

    return fetcher();
  };

  useEffect(() => {
    return () => {
      abortRef.current?.abort(); // cancel on unmount
    };
  }, []);

  return { execute };
}
