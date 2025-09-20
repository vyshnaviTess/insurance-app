type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiClientOptions {
  baseUrl: string;
  getToken?: () => Promise<string | undefined>;
  fetchImpl?: typeof fetch; // for test injection
}

export class ApiClient {
  constructor(private opts: ApiClientOptions) {}
  async request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = await this.opts.getToken?.();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await (this.opts.fetchImpl ?? fetch)(`${this.opts.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    console.warn("ApiClient network error:", err);
    // rethrow so upper layers (createPolicy, offlineSync) can enqueue
    throw err;
  }
}
  get<T>(p: string) { return this.request<T>('GET', p); }
  post<T>(p: string, b: unknown) { return this.request<T>('POST', p, b); }
  put<T>(p: string, b: unknown) { return this.request<T>('PUT', p, b); }
  delete<T>(p: string) { return this.request<T>('DELETE', p); }
}
