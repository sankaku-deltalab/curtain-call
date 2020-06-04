import { Transformation } from "@curtain-call/util";

export interface TargetProvider<T> {
  get(world: T): Transformation | undefined;
}

export class NonTargetProvider<T> implements TargetProvider<T> {
  get(_world: T): undefined {
    return undefined;
  }
}
