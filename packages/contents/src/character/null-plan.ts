import { Plan } from "./plan";

/**
 * Do nothing.
 */
export class NullPlan<T> implements Plan<T> {
  update(): void {
    // do nothing
  }
}
