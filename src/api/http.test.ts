import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "./http";

const mockFetch = (response: Partial<Response>) => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: vi.fn().mockResolvedValue("{}"),
    ...response,
  } as Response);
};

describe("apiRequest", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("sends json bodies and parses json responses", async () => {
    mockFetch({ text: vi.fn().mockResolvedValue('{"ok":true}') });

    await expect(
      apiRequest<{ ok: boolean }>("/api", {
        body: { name: "a" },
        method: "POST",
      })
    ).resolves.toEqual({ ok: true });

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe('{"name":"a"}');
    expect((init?.headers as Headers).get("Content-Type")).toBe(
      "application/json"
    );
  });

  it("adds query params and auth headers", async () => {
    localStorage.setItem("authToken", "token-a");
    mockFetch({});

    await apiRequest("/api", {
      auth: true,
      params: { eventId: "e1", skip: undefined },
    });

    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe("/api?eventId=e1");
    expect((init?.headers as Headers).get("Authorization")).toBe(
      "Bearer token-a"
    );
  });

  it("handles optional auth, existing queries, and empty bodies", async () => {
    mockFetch({ text: vi.fn().mockResolvedValue("") });

    await expect(
      apiRequest("/api?ready=1", {
        auth: true,
        params: { page: 2 },
      })
    ).resolves.toBeUndefined();

    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe("/api?ready=1&page=2");
    expect((init?.headers as Headers).get("Authorization")).toBeNull();
  });

  it("keeps urls unchanged when params are empty", async () => {
    mockFetch({});

    await apiRequest("/api", { params: { skip: undefined } });

    expect(vi.mocked(fetch).mock.calls[0][0]).toBe("/api");
  });

  it("throws response-shaped errors and required auth errors", async () => {
    mockFetch({
      ok: false,
      status: 400,
      text: vi.fn().mockResolvedValue('{"code":5,"message":"bad"}'),
    });

    await expect(apiRequest("/api")).rejects.toMatchObject({
      response: { data: { code: 5, message: "bad" }, status: 400 },
    });
    await expect(apiRequest("/api", { auth: "required" })).rejects.toThrow(
      "인증 토큰이 없습니다"
    );
  });

  it("keeps non-json error bodies readable", async () => {
    mockFetch({
      ok: false,
      status: 418,
      text: vi.fn().mockResolvedValue("plain error"),
    });

    await expect(apiRequest("/api")).rejects.toMatchObject({
      message: "HTTP 418",
      response: { data: "plain error", status: 418 },
    });
  });

  it("falls back when error messages are not strings", async () => {
    mockFetch({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue('{"message":10}'),
    });

    await expect(apiRequest("/api")).rejects.toThrow("HTTP 500");
  });
});
