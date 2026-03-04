type Handler = (payload: unknown) => Promise<void> | void;

class EventBus {
  private handlers = new Map<string, Handler[]>();

  on(event: string, handler: Handler) {
    this.handlers.set(event, [...(this.handlers.get(event) ?? []), handler]);
  }

  async emit(event: string, payload: unknown) {
    const handlers = this.handlers.get(event) ?? [];
    await Promise.all(handlers.map((handler) => Promise.resolve(handler(payload))));
  }
}

export const eventBus = new EventBus();
