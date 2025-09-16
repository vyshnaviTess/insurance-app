import { ApiClient } from "../src/data/api/client";
import { RemotePolicyRepository } from "../src/data/repositories/policyRepository";

// Helper to build a fake Response
function createJsonResponse(body: any, ok = true, status = 200): Response {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Error",
    json: async () => body,
  } as unknown as Response;
}

test("maps DTOs to domain and back", async () => {
  // 👇 mock that matches fetch signature
  const mockFetch: typeof fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    if (url.endsWith("/policies") && (!init || init.method === "GET")) {
      return createJsonResponse([
        {
          id: "1",
          type: "car",
          provider: "Acme",
          policy_number: "P1",
          start_date: "2024-01-01",
          end_date: "2025-01-01",
          premium: 100,
          coverage: {},
          documents: [],
          reminders: [],
        },
      ]);
    }
    if (init?.method === "POST") {
      const body = JSON.parse(init.body as string);
      return createJsonResponse(body);
    }
    return createJsonResponse({}, false, 404);
  });

  const api = new ApiClient({ baseUrl: 'https://192.168.0.19:3000', fetchImpl: mockFetch });
  const repo = new RemotePolicyRepository(api);

  const list = await repo.list();
  expect(list[0].provider).toBe("Acme");

  const created = await repo.create(list[0]);
  expect(created.provider).toBe("Acme");
});
