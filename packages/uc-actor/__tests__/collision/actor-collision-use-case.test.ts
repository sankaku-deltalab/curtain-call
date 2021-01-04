import { Matrix } from "trans-vector2d";
import { ActorEvent, Box2d } from "@curtain-call/entity";
import {
  worldBaseMockClass,
  actorBaseMockClass,
} from "@curtain-call/entity-mock";
import { ActorCollisionUseCase, CollisionShape } from "../../src";
import { createEventEmitterMock } from "../mocks";

const collisionShapeMockClass = jest.fn<CollisionShape, [readonly Box2d[]]>(
  (boxes: readonly Box2d[]) => ({
    calcCollisionBox2ds: jest.fn().mockReturnValue(boxes),
  })
);

describe("@curtain-call/ActorCollisionUseCase", () => {
  it("can init collision", () => {
    const uc = new ActorCollisionUseCase();
    const data = {
      enabled: true,
      shapes: [],
      group: { category: 1, mask: 2 },
      isExcess: false,
    };

    uc.initCollision(data, {
      shapes: [],
      group: { mask: 3, category: 4 },
      isExcess: true,
    });

    expect(data).toEqual({
      enabled: true,
      shapes: [],
      group: { mask: 3, category: 4 },
      isExcess: true,
    });
  });

  it("can enable", () => {
    const uc = new ActorCollisionUseCase();
    const data = {
      enabled: false,
      shapes: [],
      group: { category: 1, mask: 2 },
      isExcess: false,
    };

    uc.enable(data);

    expect(data).toEqual({
      enabled: true,
      shapes: [],
      group: { category: 1, mask: 2 },
      isExcess: false,
    });
  });

  it("can disable", () => {
    const uc = new ActorCollisionUseCase();
    const data = {
      enabled: true,
      shapes: [],
      group: { category: 1, mask: 2 },
      isExcess: false,
    };

    uc.disable(data);

    expect(data).toEqual({
      enabled: false,
      shapes: [],
      group: { category: 1, mask: 2 },
      isExcess: false,
    });
  });

  it("calculate CollisionRepresentation from initialized values", () => {
    const boxes1: readonly Box2d[] = [
      [0, 0, 1, 1],
      [1, 2, 3, 4],
    ];
    const boxes2: readonly Box2d[] = [
      [0, 0, 2, 2],
      [10, 20, 30, 40],
    ];
    const shape1 = new collisionShapeMockClass(boxes1);
    const shape2 = new collisionShapeMockClass(boxes2);

    const group = {
      mask: 0b0001,
      category: 0b0101,
    };

    const isExcess = true;

    const uc = new ActorCollisionUseCase();
    const data = {
      enabled: true,
      shapes: [shape1, shape2],
      group,
      isExcess,
    };

    const parentTrans = Matrix.from({ translation: { x: 1, y: 2 } });
    const status = uc.calcCollisionRepresentation(data, parentTrans);

    expect(status.box2ds).toEqual([...boxes1, ...boxes2]);
    expect(status.group).toEqual(group);
    expect(status.isExcess).toEqual(isExcess);

    expect(shape1.calcCollisionBox2ds).toBeCalledWith(parentTrans);
    expect(shape2.calcCollisionBox2ds).toBeCalledWith(parentTrans);
  });

  it("emit event when overlapped", () => {
    const event = createEventEmitterMock<ActorEvent>();
    const world = new worldBaseMockClass({});
    const actors = new Set(
      new Array(2).fill(0).map(() => new actorBaseMockClass({}))
    );

    const uc = new ActorCollisionUseCase();
    uc.emitEventWhenOverlapped(event, world, actors);

    expect(event.emit).toBeCalledWith("overlapped", world, actors);
  });
});
