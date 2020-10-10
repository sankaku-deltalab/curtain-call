import EventEmitter from "eventemitter3";
import {
  Actor,
  diContainer as actorDiContainer,
  IActor,
} from "@curtain-call/actor";
import {
  worldMockClass,
  transMockClass,
  healthMockClass,
  collisionMockClass,
} from "@curtain-call/actor-test-mocks";
import {
  ActorsSpawner,
  ActorsSpawnerManager,
  diContainer as spawnerDiContainer,
} from "../src";

const diContainers = [actorDiContainer, spawnerDiContainer];

const actorMock = (): Actor => {
  const actor = actorDiContainer.resolve(Actor);
  jest.spyOn(actor, "setLocalTransform");
  return actor;
};

const createSpawners = (
  num: number
): {
  actors: IActor[];
  spawners: ActorsSpawner[];
} => {
  const spawners = new Array(num).fill(0).map(() => {
    const sp = new ActorsSpawner();
    jest.spyOn(sp, "start");
    return sp;
  });

  const actors = spawners.map((sp) => {
    const ac = actorMock();
    jest.spyOn(ac, "getOneExtension").mockReturnValue(sp);
    return ac;
  });

  return { actors, spawners };
};

describe("@curtain-call/actors-spawner.ActorsSpawnerManager", () => {
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

  it("spawn ActorsSpawner", () => {
    const world = new worldMockClass();
    const { actors, spawners } = createSpawners(10);
    const asm = new ActorsSpawnerManager()
      .setActiveSpawnersLimit(2)
      .setSpawnDelay(0.2)
      .setSpawnIntervalMin(1)
      .setSpawners(actors)
      .start(world);
    const parent = actorMock().addExtension(asm);

    expect(world.addActor).toBeCalledTimes(1);
    expect(world.addActor).toBeCalledWith(actors[0]);
    expect(spawners[0].start).toBeCalledWith(world);

    asm.update(world, parent, 1);

    expect(world.addActor).toBeCalledTimes(2);
    expect(world.addActor).toBeCalledWith(actors[1]);
    expect(spawners[1].start).toBeCalledWith(world);

    spawners[1].event.emit("allActorsWereRemoved", world, []);
    asm.update(world, parent, 1);

    expect(world.addActor).toBeCalledTimes(3);
    expect(world.addActor).toBeCalledWith(actors[2]);
    expect(spawners[2].start).toBeCalledWith(world);

    asm.update(world, parent, 1);
    spawners[2].event.emit("allActorsWereRemoved", world, []);
    asm.update(world, parent, 0.2);

    expect(world.addActor).toBeCalledTimes(4);
    expect(world.addActor).toBeCalledWith(actors[3]);
    expect(spawners[3].start).toBeCalledWith(world);

    asm.update(world, parent, 2);

    expect(world.addActor).toBeCalledTimes(4);
  });

  it("can pause", () => {
    const world = new worldMockClass();
    const { actors, spawners } = createSpawners(10);
    const asm = new ActorsSpawnerManager()
      .setActiveSpawnersLimit(2)
      .setSpawnDelay(0.2)
      .setSpawnIntervalMin(1)
      .setSpawners(actors)
      .start(world);
    const parent = actorMock().addExtension(asm);

    expect(world.addActor).toBeCalledTimes(1);
    expect(world.addActor).toBeCalledWith(actors[0]);
    expect(spawners[0].start).toBeCalledWith(world);

    asm.pause(world);
    asm.update(world, parent, 1);

    expect(world.addActor).toBeCalledTimes(1);

    asm.start(world);
    asm.update(world, parent, 1);

    expect(world.addActor).toBeCalledTimes(2);
    expect(world.addActor).toBeCalledWith(actors[1]);
    expect(spawners[1].start).toBeCalledWith(world);
  });

  it("emit event when all spawners were finished", () => {
    const world = new worldMockClass();
    const { actors, spawners } = createSpawners(2);
    const asm = new ActorsSpawnerManager()
      .setActiveSpawnersLimit(2)
      .setSpawnDelay(0.2)
      .setSpawnIntervalMin(1)
      .setSpawners(actors)
      .start(world);
    const parent = actorMock().addExtension(asm);

    const ev = jest.fn();
    asm.event.on("allSpawnersWereFinished", ev);

    asm.update(world, parent, 1);

    spawners.forEach((sp) => sp.event.emit("allActorsWereRemoved", world, []));

    expect(ev).toBeCalledWith(world);
  });

  it("emit event when all active spawners were finished while paused", () => {
    const world = new worldMockClass();
    const { actors, spawners } = createSpawners(10);
    const asm = new ActorsSpawnerManager()
      .setActiveSpawnersLimit(2)
      .setSpawnDelay(0.2)
      .setSpawnIntervalMin(1)
      .setSpawners(actors)
      .start(world);
    const _parent = actorMock().addExtension(asm);

    const ev = jest.fn();
    asm.event.on("pauseCompleted", ev);

    asm.pause(world);
    spawners[0].event.emit("allActorsWereRemoved", world, []);

    expect(ev).toBeCalledWith(world);
  });
});
