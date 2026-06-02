type EventHandler<TPayload = unknown> = (payload: TPayload) => void;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export class EventWebSocket {
  id?: string;

  private connected = false;
  private readonly ws: WebSocket;
  private readonly listeners = new Map<string, Set<EventHandler>>();
  private readonly pendingMessages: string[] = [];

  constructor(url: string) {
    this.ws = new WebSocket(url);

    this.ws.addEventListener("close", () => {
      this.connected = false;
      this.dispatch("disconnect", undefined);
    });

    this.ws.addEventListener("error", () => {
      this.dispatch("error", { message: "WebSocket error" });
    });

    this.ws.addEventListener("message", (event) => {
      this.handleMessage(event.data);
    });
  }

  emit(type: string, payload?: unknown) {
    const message = JSON.stringify({ type, payload });

    if (this.ws.readyState === WebSocket.CONNECTING) {
      this.pendingMessages.push(message);
      return;
    }

    if (this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(message);
  }

  on<TPayload = unknown>(type: string, handler: EventHandler<TPayload>) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)?.add(handler as EventHandler);

    if (type === "connect" && this.connected) {
      queueMicrotask(() => handler(undefined as TPayload));
    }
  }

  off<TPayload = unknown>(type: string, handler?: EventHandler<TPayload>) {
    if (!handler) {
      this.listeners.delete(type);
      return;
    }

    this.listeners.get(type)?.delete(handler as EventHandler);
  }

  disconnect() {
    this.ws.close();
  }

  private handleMessage(data: unknown) {
    if (typeof data !== "string") return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      return;
    }

    if (!isRecord(parsed) || typeof parsed.type !== "string") return;

    if (
      parsed.type === "connected" &&
      isRecord(parsed.payload) &&
      typeof parsed.payload.id === "string"
    ) {
      this.id = parsed.payload.id;
      this.connected = true;
      this.flushPendingMessages();
      this.dispatch("connect", undefined);
    }

    this.dispatch(parsed.type, parsed.payload);
  }

  private flushPendingMessages() {
    if (this.ws.readyState !== WebSocket.OPEN) return;

    while (this.pendingMessages.length > 0) {
      const message = this.pendingMessages.shift();
      if (message) {
        this.ws.send(message);
      }
    }
  }

  private dispatch<TPayload>(type: string, payload: TPayload) {
    this.listeners.get(type)?.forEach((handler) => {
      handler(payload);
    });
  }
}

export const createWebSocketUrl = (baseUrl: string, token: string | null) => {
  const url = new URL(baseUrl);

  if (url.protocol === "https:") {
    url.protocol = "wss:";
  } else {
    url.protocol = "ws:";
  }

  if (token) {
    url.searchParams.set("token", token);
  }

  return url.toString();
};
