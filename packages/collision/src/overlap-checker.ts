import boxIntersect from "box-intersect";
import { Box2d } from "./common";
import { Collision } from "./collision";

export class OverlapChecker<TWorld, TActor> {
  checkOverlap(world: TWorld, collisions: Collision<TWorld, TActor>[]): void {
    const collided = new Map(
      collisions.map((c) => [c, new Set<Collision<TWorld, TActor>>()])
    );

    const nonHugeBoxesToCollision = this.box2dToCollisionMapping(
      collisions.filter((c) => !c.isHugeNumber())
    );
    const nonHugeBoxes = Array.from(nonHugeBoxesToCollision.keys());

    const hugeBoxesToCollision = this.box2dToCollisionMapping(
      collisions.filter((c) => c.isHugeNumber())
    );
    const hugeBoxes = Array.from(hugeBoxesToCollision.keys());

    boxIntersect(nonHugeBoxes, hugeBoxes, (i, j) => {
      const nonHugeCol = nonHugeBoxesToCollision.get(nonHugeBoxes[i]);
      const hugeCol = hugeBoxesToCollision.get(hugeBoxes[j]);
      if (!nonHugeCol || !hugeCol) throw new Error();

      collided.get(nonHugeCol)?.add(hugeCol);
      collided.get(hugeCol)?.add(nonHugeCol);
    });

    boxIntersect(nonHugeBoxes, (i, j) => {
      const nonHugeColA = nonHugeBoxesToCollision.get(nonHugeBoxes[i]);
      const nonHugeColB = nonHugeBoxesToCollision.get(nonHugeBoxes[j]);
      if (!nonHugeColA || !nonHugeColB) throw new Error();

      collided.get(nonHugeColA)?.add(nonHugeColB);
      collided.get(nonHugeColB)?.add(nonHugeColA);
    });

    collided.forEach((colBs, colA) => {
      if (colBs.size === 0) return;
      colA.event.emit("overlapped", world, colBs);
    });
  }

  private box2dToCollisionMapping(
    collisions: Collision<TWorld, TActor>[]
  ): Map<Box2d, Collision<TWorld, TActor>> {
    const colBoxes = collisions.map<[Collision<TWorld, TActor>, Box2d[]]>(
      (c) => [c, c.getBox2Ds()]
    );
    return new Map(
      colBoxes
        .map<[Box2d, Collision<TWorld, TActor>][]>(([col, boxes]) =>
          boxes.map((b) => [b, col])
        )
        .flat()
    );
  }
}
