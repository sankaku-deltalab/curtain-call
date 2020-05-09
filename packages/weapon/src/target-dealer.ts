import { Transformation } from "@curtain-call/util";

export interface TargetDealer<T> {
  get(scene: T): Transformation | undefined;
}

export class NonTargetDealer<T> implements TargetDealer<T> {
  get(_scene: T): undefined {
    return undefined;
  }
}
