import { Matrix, injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorsOverlapChecker, ActorId } from "@curtain-call/entity";
import {
  CollisionStorage,
  CollisionState,
  Box2d,
  CollisionGroup,
} from "../common";
import { injectTokens } from "../inject-tokens";

export interface TransformationStorage {
  getTransformation(
    actorIds: readonly ActorId[]
  ): Map<ActorId, Readonly<Matrix>>;
}

export interface BoxIntersect {
  calcBoxOverlapAllVsAll(boxes: readonly Box2d[]): [number, number][];
  calcBoxOverlapAlphaVsBeta(
    boxesAlpha: readonly Box2d[],
    boxesBeta: readonly Box2d[]
  ): [number, number][];
}

@injectable()
export class ActorsOverlapCheckerImpl implements ActorsOverlapChecker {
  constructor(
    @inject(injectTokens.CollisionStorage)
    private readonly collisionStorage: CollisionStorage,
    @inject(injectTokens.TransformationStorage)
    private readonly transStorage: TransformationStorage,
    @inject(injectTokens.BoxIntersect)
    private readonly boxIntersect: BoxIntersect
  ) {}

  checkOverlap(actors: readonly ActorId[]): void {
    const collisionMap: ReadonlyMap<
      ActorId,
      Readonly<CollisionState>
    > = this.collisionStorage.getCollisions(actors);
    const transMap: ReadonlyMap<
      ActorId,
      Readonly<Matrix>
    > = this.transStorage.getTransformation(actors);

    const collide: ReadonlyMap<
      ActorId,
      readonly ActorId[]
    > = this.checkOverlapInternal(collisionMap, transMap);

    collide.forEach((otherActors, mainActor) => {
      const mainState = collisionMap.get(mainActor);
      if (!mainState) throw new Error("unknown error");

      mainState.eventEmitter.emit("overlap", otherActors);
    });
  }

  private checkOverlapInternal(
    collisionMap: ReadonlyMap<ActorId, Readonly<CollisionState>>,
    transformMap: ReadonlyMap<ActorId, Readonly<Matrix>>
  ): Map<ActorId, readonly ActorId[]> {
    const enabledCollisions = Array.from(collisionMap.entries()).filter(
      ([_, state]) => state.enable
    );
    const excessCollisionMap = new Map(
      enabledCollisions.filter(([_, state]) => state.isExcess)
    );
    const nonExcessCollisionMap = new Map(
      enabledCollisions.filter(([_, state]) => !state.isExcess)
    );

    const [excessBoxes, excessBoxIdToActor] = this.calcBoxes(
      excessCollisionMap,
      transformMap
    );
    const [nonExcessBoxes, nonExcessBoxIdToActor] = this.calcBoxes(
      nonExcessCollisionMap,
      transformMap
    );

    const excessVsNonExcessOverlap = this.boxIntersect.calcBoxOverlapAlphaVsBeta(
      excessBoxes,
      nonExcessBoxes
    );
    const excessVsExcessOverlap = this.boxIntersect.calcBoxOverlapAllVsAll(
      excessBoxes
    );

    const result = new Map<ActorId, Set<ActorId>>();
    const addResultInner = (
      main: [ActorId, CollisionGroup],
      other: [ActorId, CollisionGroup]
    ): void => {
      if ((main[1].mask & other[1].category) === 0) return;
      const overlappingOthers = result.get(main[0]) || new Set();
      overlappingOthers.add(other[0]);
      result.set(main[0], overlappingOthers);
    };

    const addResult = (
      main: ActorId | undefined,
      other: ActorId | undefined
    ): void => {
      if (main === undefined) throw new Error("unknown error");
      if (other === undefined) throw new Error("unknown error");
      const mainCollision = collisionMap.get(main);
      const otherCollision = collisionMap.get(other);
      if (mainCollision === undefined) throw new Error("unknown error");
      if (otherCollision === undefined) throw new Error("unknown error");

      addResultInner(
        [main, mainCollision.group],
        [other, otherCollision.group]
      );
    };

    excessVsNonExcessOverlap.forEach(([excessIdx, nonExcessIdx]) => {
      addResult(
        excessBoxIdToActor.get(excessIdx),
        nonExcessBoxIdToActor.get(nonExcessIdx)
      );
    });

    excessVsExcessOverlap.forEach(([excessIdxAlpha, excessIdxBeta]) => {
      addResult(
        excessBoxIdToActor.get(excessIdxAlpha),
        excessBoxIdToActor.get(excessIdxBeta)
      );
    });

    return new Map(
      Array.from(result).map(([main, others]) => [main, Array.from(others)])
    );
  }

  private calcBoxes(
    collisionMap: ReadonlyMap<ActorId, Readonly<CollisionState>>,
    transformMap: ReadonlyMap<ActorId, Readonly<Matrix>>
  ): [readonly Box2d[], ReadonlyMap<number, ActorId>] {
    const allBoxes: Box2d[] = [];
    const idxToActor = new Map<number, ActorId>();

    collisionMap.forEach((state, actor) => {
      const actorTrans = transformMap.get(actor);
      if (!actorTrans) throw new Error("Transformation is not exist");
      const boxes = state.shapes.flatMap((shape) =>
        shape.calcCollisionBox2ds(actorTrans)
      );
      boxes.forEach((box) => {
        idxToActor.set(boxes.length, actor);
        allBoxes.push(box);
      });
    });
    return [allBoxes, idxToActor];
  }
}
