import { CollisionStatus, ActorBase } from "@curtain-call/entity";
import {
  actorBaseMockClass,
  worldBaseMockClass,
} from "@curtain-call/entity-mock";
import { CheckActorOverlapService, CollisionOverlapChecker } from "../../src";

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

const createActorAndCollisionStatus = (): [ActorBase, CollisionStatus] => {
  const collisionStatus: CollisionStatus = {
    box2ds: [],
    group: {
      mask: 0,
      category: 0,
    },
    isExcess: false,
  };
  const actor = new actorBaseMockClass({
    calcCollisionStatus: jest.fn().mockReturnValue(collisionStatus),
  });
  return [actor, collisionStatus];
};

describe("@curtain-call/CheckActorOverlapService", () => {
  it("find collision overlapping and notify it", () => {
    const [actor1, status1] = createActorAndCollisionStatus();
    const [actor2, status2] = createActorAndCollisionStatus();
    const [actor3, status3] = createActorAndCollisionStatus();

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

    const service = new CheckActorOverlapService();
    service.checkOverlapAndNotifyToActors(world, overlapChecker);

    expect(actor1.notifyOverlappedWith).toBeCalledWith(world, [actor2, actor3]);
    expect(actor2.notifyOverlappedWith).toBeCalledWith(world, [actor1]);
    expect(actor3.notifyOverlappedWith).toBeCalledWith(world, []);
  });
});
