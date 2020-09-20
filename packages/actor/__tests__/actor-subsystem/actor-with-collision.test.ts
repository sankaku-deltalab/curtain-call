import { EventEmitter } from "eventemitter3";
import {
  actorInterfaceMockClass,
  worldMock,
  transMockClass,
  collisionMockClass,
  collisionShapeMock,
} from "../mocks";
import {
  World,
  ActorWithCollision,
  ActorWithCollisionEvent,
  Transformation,
  Collision,
} from "../../src";
import { Actor as IActor } from "../../src/actor-interface";

export const createActorWithCollision = (): {
  actor: ActorWithCollision;
  event: ActorWithCollisionEvent;
  collision: Collision;
  trans: Transformation;
  collisionTrans: Transformation;
} => {
  const event = new EventEmitter<{
    overlapped: [World, Set<IActor>];
  }>();
  const collisionTrans = new transMockClass();
  const collision = new collisionMockClass(collisionTrans);
  const trans = new transMockClass();
  const actor = new ActorWithCollision(event, collision, trans);
  return { actor, event, collision, trans, collisionTrans };
};

describe("@curtain-call/actor.ActorWithCollision", () => {
  it("has single attached collision", () => {
    const {
      actor,
      trans,
      collision,
      collisionTrans,
    } = createActorWithCollision();

    expect(actor.getCollision()).toBe(collision);
    expect(trans.attachChild).toBeCalledWith(collisionTrans, false);
  });

  it("can notify overlapping with other actor and emit event", () => {
    const { actor, event } = createActorWithCollision();
    const ev = jest.fn();
    event.on("overlapped", ev);

    const world = new worldMock();
    const otherActor = new actorInterfaceMockClass();
    actor.notifyOverlappedWith(world, new Set([otherActor]));

    expect(ev).toBeCalledWith(world, new Set([otherActor]));
  });

  it("can add shape", () => {
    const collisionShape = new collisionShapeMock();
    const actor = createActorWithCollision().actor.addCollisionShape(
      collisionShape
    );

    expect(actor.getCollision().addShape).toBeCalledWith(collisionShape);
  });

  it("can remove shape", () => {
    const collisionShape = new collisionShapeMock();
    const actor = createActorWithCollision()
      .actor.addCollisionShape(collisionShape)
      .removeCollisionShape(collisionShape);

    expect(actor.getCollision().removeShape).toBeCalledWith(collisionShape);
  });

  it.each`
    isHuge
    ${true}
    ${false}
  `("can set collision as huge number", ({ isHuge }) => {
    const { actor, collision } = createActorWithCollision();
    actor.setCollisionAsHugeNumber(isHuge);

    expect(collision.setIsHugeNumber).toBeCalledWith(isHuge);
  });

  it("can set collision group", () => {
    const group = {
      category: 0,
      mask: 0,
    };
    const { actor, collision } = createActorWithCollision();
    const r = actor.setCollisionGroup(group);

    expect(r).toBe(actor);
    expect(collision.setGroup).toBeCalledWith(group);
  });

  it.each`
    enable
    ${true}
    ${false}
  `("can set collision enable", ({ enable }) => {
    const { actor, collision } = createActorWithCollision();
    actor.setCollisionEnable(enable);

    expect(collision.setEnable).toBeCalledWith(enable);
  });
});
