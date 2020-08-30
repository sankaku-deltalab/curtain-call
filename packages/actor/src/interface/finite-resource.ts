export interface FiniteResource {
  /**
   * Init initial value and max value.
   *
   * @param initialValue Initial value.
   * @param maxValue Max value.
   * @returns this.
   */
  init(initialValue: number, maxValue: number): this;

  /**
   * Get current value.
   *
   * @returns Current value.
   */
  value(): number;

  /**
   * Get max value.
   *
   * @returns Max value.
   */
  max(): number;

  /**
   * Add value.
   *
   * @param value Adding value.
   * @returns Added result.
   */
  add(value: number): { variation: number; maxed: boolean };

  /**
   * Subtract value.
   *
   * @param value Subtracting value.
   * @returns Subtracted result.
   */
  sub(value: number): { variation: number; zeroed: boolean };
}
