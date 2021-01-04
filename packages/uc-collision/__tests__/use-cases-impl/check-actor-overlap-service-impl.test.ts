import { CollisionRepresentation, ActorBase } from "@curtain-call/entity";
import {
  actorBaseMockClass,
  worldBaseMockClass,
} from "@curtain-call/entity-mock";
import {
  CheckActorOverlapServiceImpl,
  CollisionOverlapChecker,
} from "../../src";

const overlapCheckerMockClass = jest.fn<
  CollisionOverlapChecker,
  [Partial<CollisionOverlapChecker>]
>((option: Partial<CollisionOverlapChecker> = {}) =>
  Object.assign(
    {
      calcOverlapAllVsAll: jest.fn(),
    },
    option
  )
);

const createActorAndCollisionRepresentation = (): [
  ActorBase,
  CollisionRepresentation
] => {
  const collisionRepresentation: CollisionRepresentation = {
    box2ds: [],
    group: {
      mask: 0,
      category: 0,
    },
    isExcess: false,
  };
  const actor = new actorBaseMockClass({
    calcCollisionRepresentation: jest
      .fn()
      .mockReturnValue(collisionRepresentation),
  });
  return [actor, collisionRepresentation];
};

describe("@curtain-call/CheckActorOverlapService", () => {
  it("find collision overlapping and notify it", () => {
    const [actor1, status1] = createActorAndCollisionRepresentation();
    const [actor2, status2] = createActorAndCollisionRepresentation();
    const [actor3, status3] = createActorAndCollisionRepresentation();

    // st1 -> st2, st3
    // st2 -> st1
    // st3 -> None
    const overlapChecker = new overlapCheckerMockClass({
      calcOverlapAllVsAll: jest.fn().mockReturnValue(
        new Map([
          [status1, [status2, status3]],
          [status2, [status1]],
          [status3, []],
        ])
      ),
    });

    const world = new worldBaseMockClass({
      iterateActors: jest.fn().mockReturnValue([actor1, actor2, actor3]),
    });

    const service = new CheckActorOverlapServiceImpl();
    service.checkOverlapAndNotifyToActors(world, overlapChecker);

    expect(actor1.notifyOverlappedWith).toBeCalledWith(world, [actor2, actor3]);
    expect(actor2.notifyOverlappedWith).toBeCalledWith(world, [actor1]);
    expect(actor3.notifyOverlappedWith).toBeCalledWith(world, []);
  });
});
