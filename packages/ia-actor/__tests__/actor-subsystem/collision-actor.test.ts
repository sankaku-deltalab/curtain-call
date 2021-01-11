import { ActorEvent } from "@curtain-call/entity";
import {
  actorBaseMockClass,
  worldBaseMockClass,
} from "@curtain-call/entity-mock";
import {
  ActorCollisionData,
  ActorCollisionUseCase,
  EventEmitter,
} from "@curtain-call/uc-actor";
import { Matrix } from "trans-vector2d";
import { CollisionActor } from "../../src";

const createCollisionData = (): ActorCollisionData => ({
  enabled: true,
  shapes: [],
  group: { category: 0, mask: 0 },
  isExcess: false,
});

const ucMock = jest.fn<ActorCollisionUseCase, []>(() => ({
  createInitialCollisionData: jest
    .fn()
    .mockReturnValueOnce(createCollisionData()),
  initCollision: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  calcCollisionRepresentation: jest.fn(),
  emitEventWhenOverlapped: jest.fn(),
}));

const createUc = (): [ActorCollisionUseCase, ActorCollisionData] => {
  const data = createCollisionData();
  const uc = new ucMock();
  uc.createInitialCollisionData = jest.fn().mockReturnValue(data);
  return [uc, data];
};

const eeMock = jest.fn<EventEmitter<ActorEvent>, []>(() => ({
  emit: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  off: jest.fn(),
  removeAllListeners: jest.fn(),
}));

describe("@curtain-call/CollisionActor", () => {
  it("use created initial collision", () => {
    const uc = new ucMock();
    const _collisionActor = new CollisionActor(uc);
    expect(uc.createInitialCollisionData).toBeCalled();
  });

  it("can init with actor and event", () => {
    const uc = new ucMock();
    const collisionActor = new CollisionActor(uc);

    const r = collisionActor.initCollisionActor(
      new actorBaseMockClass({}),
      new eeMock()
    );

    expect(r).toBe(collisionActor);
  });

  it("can init collision", () => {
    const [uc, data] = createUc();
    const collisionActor = new CollisionActor(uc);

    const args = {
      shapes: [],
      group: { mask: 3, category: 4 },
      isExcess: true,
    };
    collisionActor.initCollision(args);

    expect(uc.initCollision).toBeCalledWith(data, args);
  });

  it("can enable", () => {
    const [uc, data] = createUc();
    const collisionActor = new CollisionActor(uc);

    collisionActor.enableCollision();

    expect(uc.enable).toBeCalledWith(data);
  });

  it("can disable", () => {
    const [uc, data] = createUc();
    const collisionActor = new CollisionActor(uc);

    collisionActor.disableCollision();

    expect(uc.disable).toBeCalledWith(data);
  });

  it("calculate CollisionRepresentation", () => {
    const [uc, data] = createUc();
    const rep = {
      box2ds: [],
      group: { category: 1, mask: 2 },
      isExcess: true,
    };
    uc.calcCollisionRepresentation = jest.fn().mockReturnValue(rep);

    const parentTrans = Matrix.translation({ x: 1, y: 2 });
    const parent = new actorBaseMockClass({
      transformation: jest.fn().mockReturnValue(parentTrans),
    });

    const collisionActor = new CollisionActor(uc).initCollisionActor(
      parent,
      new eeMock()
    );

    const r = collisionActor.calcCollisionRepresentation();
    expect(r).toBe(rep);
    expect(uc.calcCollisionRepresentation).toBeCalledWith(data, parentTrans);
  });

  it("emit event when overlapped", () => {
    const world = new worldBaseMockClass({});
    const event = new eeMock();
    const overlappedOthers = [new actorBaseMockClass({})];
    const uc = new ucMock();
    const collisionActor = new CollisionActor(uc).initCollisionActor(
      new actorBaseMockClass({}),
      event
    );

    collisionActor.notifyOverlappedWith(world, overlappedOthers);

    expect(uc.emitEventWhenOverlapped).toBeCalledWith(
      event,
      world,
      overlappedOthers
    );
  });
});
