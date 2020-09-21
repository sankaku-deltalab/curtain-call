import { EventEmitter } from "eventemitter3";
import { worldMock } from "../mocks";
import { World, ActorWithWorld, ActorWithWorldEvent } from "../../src";

export const createActorWithWorld = (): {
  actor: ActorWithWorld;
  event: ActorWithWorldEvent;
} => {
  const event = new EventEmitter<{
    addedToWorld: [World];
    removedFromWorld: [World];
  }>();
  const actor = new ActorWithWorld(event);
  return { actor, event };
};

describe("@curtain-call/actor.ActorWithWorld", () => {
  it("can be notified added to world and emit event", () => {
    const { actor, event } = createActorWithWorld();
    const ev = jest.fn();
    event.on("addedToWorld", ev);

    const world = new worldMock();
    actor.notifyAddedToWorld(world);

    expect(ev).toBeCalledWith(world);
  });

  it("can be notified removed from world and emit event", () => {
    const { actor, event } = createActorWithWorld();
    const ev = jest.fn();
    event.on("removedFromWorld", ev);

    const world = new worldMock();
    actor.notifyAddedToWorld(world);
    actor.notifyRemovedFromWorld(world);

    expect(ev).toBeCalledWith(world);
  });

  it("can express removing self from world", () => {
    const actor = createActorWithWorld().actor.reserveRemovingSelfFromWorld();

    const world = new worldMock();
    expect(actor.shouldBeRemovedFromWorld(world)).toBe(true);
  });

  it("can revoke removing self expressing", () => {
    const actor = createActorWithWorld()
      .actor.reserveRemovingSelfFromWorld()
      .cancelRemovingSelfFromWorld();

    const world = new worldMock();
    expect(actor.shouldBeRemovedFromWorld(world)).toBe(false);
  });

  it("can set life time", () => {
    const { actor } = createActorWithWorld();
    const world = new worldMock();

    const lifeTime = 123;
    actor.setLifeTime(lifeTime);
    expect(actor.shouldBeRemovedFromWorld(world)).toBe(false);

    actor.update(world, lifeTime / 2);
    actor.update(world, lifeTime / 2);

    expect(actor.shouldBeRemovedFromWorld(world)).toBe(true);
  });
});
