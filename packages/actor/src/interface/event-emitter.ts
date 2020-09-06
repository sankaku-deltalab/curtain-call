export interface EventEmitter<
  T extends Record<string, ReadonlyArray<unknown>>
> {
  /**
   * Calls each of the listeners registered for a given event.
   */
  emit<V extends keyof T>(event: V, ...args: T[V]): boolean;

  /**
   * Add a listener for a given event.
   */
  on<V extends keyof T>(event: V, fn: (...args: T[V]) => void): this;

  /**
   * Add a one-time listener for a given event.
   */
  once<V extends keyof T>(event: V, fn: (...args: T[V]) => void): this;

  /**
   * Remove the listeners of a given event.
   */
  off<V extends keyof T>(event: V, fn?: (...args: T[V]) => void): this;

  /**
   * Remove all listeners, or those of the specified event.
   */
  removeAllListeners<V extends keyof T>(event?: V): this;
}
