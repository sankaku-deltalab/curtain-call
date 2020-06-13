import boxIntersect from "box-intersect";
import { Box2d } from "./common";
import { Collision } from "./collision";

export class OverlapChecker<TWorld, TActor> {
  checkOverlap(world: TWorld, collisions: Collision<TWorld, TActor>[]): void {
    const cols = collisions.filter((col) => col.isEnable());

    const collided = new Map(
      cols.map((c) => [c, new Set<Collision<TWorld, TActor>>()])
    );

    const nonHugeBoxesToCollision = this.box2dToCollisionMapping(
      cols.filter((c) => !c.isHugeNumber())
    );
    const nonHugeBoxes = Array.from(nonHugeBoxesToCollision.keys());

    const hugeBoxesToCollision = this.box2dToCollisionMapping(
      cols.filter((c) => c.isHugeNumber())
    );
    const hugeBoxes = Array.from(hugeBoxesToCollision.keys());

    const updateCollided = (
      a: Collision<TWorld, TActor>,
      b: Collision<TWorld, TActor>
    ): void => {
      if (a.canCollideWith(b)) collided.get(a)?.add(b);
      if (b.canCollideWith(a)) collided.get(b)?.add(a);
    };

    boxIntersect(nonHugeBoxes, hugeBoxes, (i, j) => {
      const nonHugeCol = nonHugeBoxesToCollision.get(nonHugeBoxes[i]);
      const hugeCol = hugeBoxesToCollision.get(hugeBoxes[j]);
      if (!nonHugeCol || !hugeCol) throw new Error();

      updateCollided(nonHugeCol, hugeCol);
    });

    boxIntersect(nonHugeBoxes, (i, j) => {
      const nonHugeColA = nonHugeBoxesToCollision.get(nonHugeBoxes[i]);
      const nonHugeColB = nonHugeBoxesToCollision.get(nonHugeBoxes[j]);
      if (!nonHugeColA || !nonHugeColB) throw new Error();

      updateCollided(nonHugeColA, nonHugeColB);
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
