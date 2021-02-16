import EE from "eventemitter3";
import { injectable } from "./tsyringe-dependencies";

export interface EventEmitter<T extends Record<string, unknown[]>> {
  emit<V extends keyof T>(name: V, ...args: T[V]): void;
  on<V extends keyof T>(name: V, cb: (...args: T[V]) => void): void;
  off<V extends keyof T>(name: V, cb: (...args: T[V]) => void): void;
}

class EEWrapper<T extends Record<string, unknown[]>>
  implements EventEmitter<T> {
  private readonly ee: EE = new EE();

  emit<V extends keyof T>(name: V & string, ...args: T[V]): void {
    this.ee.emit(name, ...args);
  }
  on<V extends keyof T>(name: V & string, cb: (...args: T[V]) => void): void {
    this.ee.on(name, (cb as unknown) as (args: unknown[]) => void);
  }

  off<V extends keyof T>(name: V & string, cb: (...args: T[V]) => void): void {
    this.ee.off(name, (cb as unknown) as (args: unknown[]) => void);
  }
}

@injectable()
export class EventEmitterFactory {
  create<T extends Record<string, unknown[]>>(): EventEmitter<T> {
    return new EEWrapper<T>();
  }
}
