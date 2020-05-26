import { Transformation } from "@curtain-call/util";

export interface TargetDealer<T> {
  get(world: T): Transformation | undefined;
}

export class NonTargetDealer<T> implements TargetDealer<T> {
  get(_world: T): undefined {
    return undefined;
  }
}
