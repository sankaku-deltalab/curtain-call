import boxIntersect from "box-intersect";
import { injectable } from "@curtain-call/shared-dependencies";
import { Box2d, BoxIntersect } from "@curtain-call/uc-collision";

@injectable()
export class BoxIntersectImpl implements BoxIntersect {
  calcBoxOverlapAllVsAll(boxes: readonly Box2d[]): [number, number][] {
    return boxIntersect(boxes);
  }

  calcBoxOverlapAlphaVsBeta(
    boxesAlpha: readonly Box2d[],
    boxesBeta: readonly Box2d[]
  ): [number, number][] {
    return boxIntersect(boxesAlpha, boxesBeta);
  }
}
