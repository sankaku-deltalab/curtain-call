import { World } from "@curtain-call/world";
import { Plan } from "./plan";

/**
 * Do nothing.
 */
export class NullPlan<TWorld extends World> implements Plan<TWorld> {
  start(): void {
    // do nothing
  }

  update(): void {
    // do nothing
  }
}
