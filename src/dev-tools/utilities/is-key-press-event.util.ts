import type { KeyPressEvent } from './../declarations/interfaces/key-press-event.interface';

export function isKeyPressEvent(event: unknown): event is KeyPressEvent {
  if (typeof event !== 'object' || event === null) {
    return false;
  }

  const eventKeys: Set<keyof KeyPressEvent> = new Set<keyof KeyPressEvent>(['ctrl', 'name']);
  return Array.from(eventKeys).every((eventKey: keyof KeyPressEvent) => eventKey in event);
}
