import { EventEmitter } from "../src";

export function createEventEmitterMock<
  T extends Record<string, readonly unknown[]>
>(): EventEmitter<T> {
  const mockClass = jest.fn<EventEmitter<{}>, []>(() => ({
    emit: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    off: jest.fn(),
    removeAllListeners: jest.fn(),
  }));
  return new mockClass();
}
