import EventEmitter from "eventemitter3";
import { Matrix } from "trans-vector2d";
import {
  Actor,
  diContainer as actorDiContainer,
  Transformation,
} from "@curtain-call/actor";
import {
  worldMockClass,
  transMockClass,
  healthMockClass,
  collisionMockClass,
} from "./mocks";
import { ActorsSpawner, diContainer as spawnerDiContainer } from "../src";

const diContainers = [actorDiContainer, spawnerDiContainer];

const actorMock = (): Actor => {
  const actor = actorDiContainer.resolve(Actor);
  jest.spyOn(actor, "setLocalTransform");
  return actor;
};

const createSpawner = (): { trans: Transformation; spawner: ActorsSpawner } => {
  const spawner = new ActorsSpawner();
  return { trans: spawner.getTransformation(), spawner };
};

const setupSpawner = (
  spawner: ActorsSpawner
): {
  actors: Actor[];
  spawning: jest.Mock;
  schedule: [Matrix, number][];
} => {
  const actors = [actorMock(), actorMock(), actorMock(), actorMock()];
  const spawning = jest.fn().mockImplementation((i) => actors[i]);
  const schedule: [Matrix, number][] = [
    [Matrix.identity, 0],
    [Matrix.translation({ x: 1, y: 2 }), 0.5],
    [Matrix.translation({ x: 3, y: 4 }), 0.5],
    [Matrix.translation({ x: 5, y: 6 }), 1.2],
  ];
  spawner.setSpawningFunction(spawning).setSchedule(schedule);

  return { actors, spawning, schedule };
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

  it("is sub-class of Actor", () => {
    const spawner = createSpawner().spawner;
    expect(spawner).toBeInstanceOf(Actor);
  });

  it("spawn actors with given transformation and times", () => {
    const spawner = createSpawner().spawner;
    const { actors, spawning, schedule } = setupSpawner(spawner);

    const world = new worldMockClass();
    spawner.start(world);
    expect(spawning).toBeCalledWith(0, 4);
    expect(spawning).toBeCalledTimes(1);
    expect(world.addActor).toBeCalledWith(actors[0]);
    expect(actors[0].setLocalTransform).toBeCalledWith(schedule[0][0]);

    spawner.update(world, 0.3);
    expect(spawning).toBeCalledTimes(1);

    spawner.update(world, 0.3);
    expect(spawning).toBeCalledWith(1, 4);
    expect(spawning).toBeCalledWith(2, 4);
    expect(spawning).toBeCalledTimes(3);
    expect(world.addActor).toBeCalledWith(actors[1]);
    expect(world.addActor).toBeCalledWith(actors[2]);
    expect(actors[1].setLocalTransform).toBeCalledWith(schedule[1][0]);
    expect(actors[2].setLocalTransform).toBeCalledWith(schedule[2][0]);

    spawner.update(world, 0.7);
    spawner.update(world, 0.7);
    expect(spawning).toBeCalledWith(3, 4);
    expect(spawning).toBeCalledTimes(4);
    expect(world.addActor).toBeCalledWith(actors[3]);
    expect(actors[3].setLocalTransform).toBeCalledWith(schedule[3][0]);
  });

  it("do not spawn before start", () => {
    const spawner = createSpawner().spawner;
    const { spawning } = setupSpawner(spawner);

    const world = new worldMockClass();
    spawner.update(world, 10);
    expect(spawning).not.toBeCalled();
  });

  it("emit event when all spawned actors were dead", () => {
    const spawner = createSpawner().spawner;
    const { actors } = setupSpawner(spawner);

    const deadEvent = jest.fn();
    spawner.event.on("allActorsWereDead", deadEvent);

    const world = new worldMockClass();
    spawner.start(world);
    spawner.update(world, 10);

    const deadActors = [2, 1, 0, 3].map((i) => actors[i]);
    deadActors.forEach((ac) =>
      ac.kill(world, actorMock(), { name: "testDamage" })
    );

    expect(deadEvent).toBeCalledWith(world, deadActors);
  });

  it("emit event when all spawned actors were removed from world", () => {
    const spawner = createSpawner().spawner;
    const { actors } = setupSpawner(spawner);

    const removedEvent = jest.fn();
    spawner.event.on("allActorsWereRemoved", removedEvent);

    const world = new worldMockClass();
    spawner.start(world);
    spawner.update(world, 10);

    const removedActors = [2, 1, 0, 3].map((i) => actors[i]);
    removedActors.forEach((ac) => ac.notifyRemovedFromWorld(world));

    expect(removedEvent).toBeCalledWith(world, removedActors);
  });

  it("reserve removing self when all spawned actors were removed from world", () => {
    const spawner = createSpawner().spawner;
    const { actors } = setupSpawner(spawner);

    const removedEvent = jest.fn();
    spawner.event.on("allActorsWereRemoved", removedEvent);

    const world = new worldMockClass();
    spawner.start(world);
    spawner.update(world, 10);

    expect(spawner.shouldRemoveSelfFromWorld()).toBe(false);

    const removedActors = [2, 1, 0, 3].map((i) => actors[i]);
    removedActors.forEach((ac) => ac.notifyRemovedFromWorld(world));

    spawner.update(world, 10);
    expect(spawner.shouldRemoveSelfFromWorld()).toBe(true);
  });
});
