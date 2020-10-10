import EventEmitter from "eventemitter3";
import { Matrix } from "trans-vector2d";
import { Actor, diContainer as actorDiContainer } from "@curtain-call/actor";
import {
  worldMockClass,
  transMockClass,
  healthMockClass,
  collisionMockClass,
} from "@curtain-call/actor-test-mocks";
import { ActorsSpawner, diContainer as spawnerDiContainer } from "../src";

const diContainers = [actorDiContainer, spawnerDiContainer];

const actorMock = (): Actor => {
  const actor = actorDiContainer.resolve(Actor);
  jest.spyOn(actor, "setLocalTransform");
  return actor;
};

const setupSpawner = (
  spawner: ActorsSpawner
): {
  actors: Actor[];
  spawning: jest.Mock;
  schedule: [number, Matrix][];
  parent: Actor;
} => {
  const actors = [actorMock(), actorMock(), actorMock(), actorMock()];
  const spawning = jest.fn().mockImplementation((i) => actors[i]);
  const schedule: [number, Matrix][] = [
    [0, Matrix.identity],
    [0.5, Matrix.translation({ x: 1, y: 2 })],
    [0.5, Matrix.translation({ x: 3, y: 4 })],
    [1.2, Matrix.translation({ x: 5, y: 6 })],
  ];
  spawner.setSpawningFunction(spawning).setSchedule(schedule);
  const parent = actorMock().addExtension(spawner);

  return { actors, spawning, schedule, parent };
};

describe("@curtain-call/actors-spawner", () => {
  beforeAll(() => {
    diContainers.forEach((c) => {
      c.register("EventEmitter", EventEmitter);
      c.register("Transformation", transMockClass);
      c.register("FiniteResource", healthMockClass);
      c.register("Collision", collisionMockClass);
    });
  });

  afterAll(() => {
    diContainers.forEach((c) => {
      c.reset();
    });
  });

  it("spawn actors with given transformation and times", () => {
    const spawner = new ActorsSpawner();
    const { actors, spawning, schedule, parent } = setupSpawner(spawner);

    const world = new worldMockClass();
    spawner.start(world);
    expect(spawning).toBeCalledWith(0, 4);
    expect(spawning).toBeCalledTimes(1);
    expect(world.addActor).toBeCalledWith(actors[0]);
    expect(actors[0].setLocalTransform).toBeCalledWith(schedule[0][1]);

    spawner.update(world, parent, 0.3);
    expect(spawning).toBeCalledTimes(1);

    spawner.update(world, parent, 0.3);
    expect(spawning).toBeCalledWith(1, 4);
    expect(spawning).toBeCalledWith(2, 4);
    expect(spawning).toBeCalledTimes(3);
    expect(world.addActor).toBeCalledWith(actors[1]);
    expect(world.addActor).toBeCalledWith(actors[2]);
    expect(actors[1].setLocalTransform).toBeCalledWith(schedule[1][1]);
    expect(actors[2].setLocalTransform).toBeCalledWith(schedule[2][1]);

    spawner.update(world, parent, 0.7);
    spawner.update(world, parent, 0.7);
    expect(spawning).toBeCalledWith(3, 4);
    expect(spawning).toBeCalledTimes(4);
    expect(world.addActor).toBeCalledWith(actors[3]);
    expect(actors[3].setLocalTransform).toBeCalledWith(schedule[3][1]);
  });

  it("do not spawn before start", () => {
    const spawner = new ActorsSpawner();
    const { spawning, parent } = setupSpawner(spawner);

    const world = new worldMockClass();
    spawner.update(world, parent, 10);
    expect(spawning).not.toBeCalled();
  });

  it("emit event when all spawned actors were dead", () => {
    const spawner = new ActorsSpawner();
    const { actors, parent } = setupSpawner(spawner);

    const deadEvent = jest.fn();
    spawner.event.on("allActorsWereDead", deadEvent);

    const world = new worldMockClass();
    spawner.start(world);
    spawner.update(world, parent, 10);

    const deadActors = [2, 1, 0, 3].map((i) => actors[i]);
    deadActors.forEach((ac) =>
      ac.killSelf(world, actorMock(), { name: "testDamage" })
    );

    expect(deadEvent).toBeCalledWith(world, deadActors);
  });

  it("emit event when all spawned actors were removed from world", () => {
    const spawner = new ActorsSpawner();
    const { actors, parent } = setupSpawner(spawner);

    const removedEvent = jest.fn();
    spawner.event.on("allActorsWereRemoved", removedEvent);

    const world = new worldMockClass();
    spawner.start(world);
    spawner.update(world, parent, 10);

    const removedActors = [2, 1, 0, 3].map((i) => actors[i]);
    removedActors.forEach((ac) => ac.notifyRemovedFromWorld(world));

    expect(removedEvent).toBeCalledWith(world, removedActors);
  });

  it("reserve removing self when all spawned actors were removed from world", () => {
    const spawner = new ActorsSpawner();
    const { actors, parent } = setupSpawner(spawner);

    const removedEvent = jest.fn();
    spawner.event.on("allActorsWereRemoved", removedEvent);

    const world = new worldMockClass();
    spawner.start(world);
    spawner.update(world, parent, 10);

    expect(spawner.shouldBeRemovedFromWorld()).toBe(false);

    const removedActors = [2, 1, 0, 3].map((i) => actors[i]);
    removedActors.forEach((ac) => ac.notifyRemovedFromWorld(world));

    spawner.update(world, parent, 10);
    expect(spawner.shouldBeRemovedFromWorld()).toBe(true);
  });
});
