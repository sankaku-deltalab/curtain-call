import {
  Box2d,
  canCollideGroup,
  CollisionRepresentation,
} from "@curtain-call/entity";
import { CollisionOverlapChecker } from "@curtain-call/uc-collision";

export interface BoxIntersect {
  calcIntersectAllVsAll(boxes: readonly Box2d[]): [number, number][];
  calcIntersectAlphaVsBeta(
    boxesAlpha: readonly Box2d[],
    boxesBeta: readonly Box2d[]
  ): [number, number][];
}

/**
 * `CollisionOverlapChecker` is used for collide detection.
 */
export class CollisionOverlapCheckerImpl implements CollisionOverlapChecker {
  constructor(private readonly boxIntersect: BoxIntersect) {}

  /**
   * Calculate all collision overlapping.
   *
   * @param statuses Collision statuses.
   * @returns Overlapping collision representationes.
   */
  calcOverlapAllVsAll(
    statuses: ReadonlySet<CollisionRepresentation>
  ): ReadonlyMap<CollisionRepresentation, readonly CollisionRepresentation[]> {
    const statusesArray = Array.from(statuses);
    const excessStatuses = statusesArray.filter((st) => st.isExcess);
    const notExcessStatuses = statusesArray.filter((st) => !st.isExcess);

    const excessBoxToStatus = this.calcBoxToStatus(excessStatuses);
    const excessBoxes: Box2d[] = Array.from(excessBoxToStatus.keys());
    const notExcessBoxToStatus = this.calcBoxToStatus(notExcessStatuses);
    const notExcessBoxes: Box2d[] = Array.from(notExcessBoxToStatus.keys());

    const collideResult = new Map<
      CollisionRepresentation,
      Set<CollisionRepresentation>
    >(statusesArray.map((st) => [st, new Set()]));

    const excessToNotExcessOverlapped = this.boxIntersect.calcIntersectAlphaVsBeta(
      excessBoxes,
      notExcessBoxes
    );

    const notExcessToNotExcessOverlapped = this.boxIntersect.calcIntersectAllVsAll(
      notExcessBoxes
    );

    excessToNotExcessOverlapped.forEach(([excessI, notExcessJ]) => {
      const st1 = excessStatuses[excessI];
      const st2 = notExcessStatuses[notExcessJ];
      if (!this.canOverlap(st1, st2)) return;
      collideResult.get(st1)?.add(st2);
    });

    notExcessToNotExcessOverlapped.forEach(([excessI, excessJ]) => {
      const st1 = notExcessStatuses[excessI];
      const st2 = notExcessStatuses[excessJ];
      if (!this.canOverlap(st1, st2)) return;
      collideResult.get(st1)?.add(st2);
    });

    const result = new Map<
      CollisionRepresentation,
      readonly CollisionRepresentation[]
    >();
    collideResult.forEach((others, main) => {
      if (others.size === 0) return;
      result.set(main, Array.from(others));
    });
    return result;
  }

  private calcBoxToStatus(
    collisionRepresentationes: readonly CollisionRepresentation[]
  ): ReadonlyMap<Box2d, CollisionRepresentation> {
    const boxToStatus = new Map<Box2d, CollisionRepresentation>();

    collisionRepresentationes.forEach((st) => {
      st.box2ds.forEach((box) => {
        boxToStatus.set(box, st);
      });
    });

    return boxToStatus;
  }

  private canOverlap(
    status1: CollisionRepresentation,
    status2: CollisionRepresentation
  ): boolean {
    return canCollideGroup(status1.group, status2.group);
  }
}
