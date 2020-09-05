import { FiniteResource as IFiniteResource } from "@curtain-call/actor";

export class FiniteResource implements IFiniteResource {
  private current = 0;
  private maxValue = 0;

  /**
   * Init initial value and max value.
   *
   * @param initialValue Initial value.
   * @param maxValue Max value.
   * @returns this.
   */
  init(initialValue: number, maxValue: number): this {
    if (initialValue < 0) throw new Error("Initial value must be non-negative");
    if (maxValue < 0) throw new Error("Max value must be non-negative");
    if (initialValue > maxValue)
      throw new Error("Max value must be >= initial value");

    this.current = initialValue;
    this.maxValue = maxValue;
    return this;
  }

  /**
   * Get current value.
   *
   * @returns Current value.
   */
  value(): number {
    return this.current;
  }

  /**
   * Get max value.
   *
   * @returns Max value.
   */
  max(): number {
    return this.maxValue;
  }

  /**
   * Add value.
   *
   * @param value Adding value.
   * @returns Added result.
   */
  add(value: number): { variation: number; maxed: boolean } {
    const diff = this.maxValue - this.current;
    if (diff === 0) {
      return { variation: 0, maxed: false };
    }
    if (diff <= value) {
      this.current = this.maxValue;
      return { variation: diff, maxed: true };
    }

    this.current += value;
    return { variation: value, maxed: false };
  }

  /**
   * Subtract value.
   *
   * @param value Subtracting value.
   * @returns Subtracted result.
   */
  sub(value: number): { variation: number; zeroed: boolean } {
    const current = this.current;
    if (current === 0) {
      return { variation: 0, zeroed: false };
    }
    if (current <= value) {
      this.current = 0;
      return { variation: -current, zeroed: true };
    }

    this.current -= value;
    return { variation: -value, zeroed: false };
  }
}
