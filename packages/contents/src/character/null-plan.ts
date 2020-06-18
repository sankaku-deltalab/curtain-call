import { Plan } from "./plan";
import { World } from "@curtain-call/world";

/**
 * Do nothing.
 */
export class NullPlan<T extends World> implements Plan<T> {
  update(): void {
    // do nothing
  }
}
