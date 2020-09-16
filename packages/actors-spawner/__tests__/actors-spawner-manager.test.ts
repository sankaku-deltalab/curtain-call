import EventEmitter from "eventemitter3";
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
import {
  ActorsSpawner,
  ActorsSpawnerManager,
  diContainer as spawnerDiContainer,
} from "../src";

const diContainers = [actorDiContainer, spawnerDiContainer];

const createSpawner = (): { trans: Transformation; spawner: ActorsSpawner } => {
  const spawner = new ActorsSpawner();
  return { trans: spawner.getTransformation(), spawner };
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

  it("is sub-class of Actor", () => {
    const spawner = createSpawner().spawner;
    expect(spawner).toBeInstanceOf(Actor);
  });

  it("spawn ActorsSpawner", () => {
    const world = new worldMockClass();
    const spawners = new Array(10).fill(0).map(() => {
      const sp = new ActorsSpawner();
      jest.spyOn(sp, "start");
      return sp;
    });
    const asm = new ActorsSpawnerManager()
      .setActiveSpawnersLimit(2)
      .setSpawnDelay(0.2)
      .setSpawnIntervalMin(1)
      .setSpawners(spawners)
      .start(world);

    asm.notifyAddedToWorld(world);

    expect(world.addActor).toBeCalledTimes(1);
    expect(world.addActor).toBeCalledWith(spawners[0]);
    expect(spawners[0].start).toBeCalledWith(world);

    asm.update(world, 1);

    expect(world.addActor).toBeCalledTimes(2);
    expect(world.addActor).toBeCalledWith(spawners[1]);
    expect(spawners[1].start).toBeCalledWith(world);

    spawners[1].event.emit("allActorsWereRemoved", world, []);
    asm.update(world, 1);

    expect(world.addActor).toBeCalledTimes(3);
    expect(world.addActor).toBeCalledWith(spawners[2]);
    expect(spawners[2].start).toBeCalledWith(world);

    asm.update(world, 1);
    spawners[2].event.emit("allActorsWereRemoved", world, []);
    asm.update(world, 0.2);

    expect(world.addActor).toBeCalledTimes(4);
    expect(world.addActor).toBeCalledWith(spawners[3]);
    expect(spawners[3].start).toBeCalledWith(world);

    asm.update(world, 2);

    expect(world.addActor).toBeCalledTimes(4);
  });

  it("can pause", () => {
    const world = new worldMockClass();
    const spawners = new Array(10).fill(0).map(() => {
      const sp = new ActorsSpawner();
      jest.spyOn(sp, "start");
      return sp;
    });
    const asm = new ActorsSpawnerManager()
      .setActiveSpawnersLimit(2)
      .setSpawnDelay(0.2)
      .setSpawnIntervalMin(1)
      .setSpawners(spawners)
      .start(world);

    asm.notifyAddedToWorld(world);

    expect(world.addActor).toBeCalledTimes(1);
    expect(world.addActor).toBeCalledWith(spawners[0]);
    expect(spawners[0].start).toBeCalledWith(world);

    asm.pause(world);
    asm.update(world, 1);

    expect(world.addActor).toBeCalledTimes(1);

    asm.start(world);
    asm.update(world, 1);

    expect(world.addActor).toBeCalledTimes(2);
    expect(world.addActor).toBeCalledWith(spawners[1]);
    expect(spawners[1].start).toBeCalledWith(world);
  });

  it("emit event when all spawners were finished", () => {
    const world = new worldMockClass();
    const spawners = new Array(2).fill(0).map(() => {
      const sp = new ActorsSpawner();
      jest.spyOn(sp, "start");
      return sp;
    });
    const asm = new ActorsSpawnerManager()
      .setActiveSpawnersLimit(2)
      .setSpawnDelay(0.2)
      .setSpawnIntervalMin(1)
      .setSpawners(spawners)
      .start(world);

    const ev = jest.fn();
    asm.event.on("allSpawnersWereFinished", ev);

    asm.notifyAddedToWorld(world);
    asm.update(world, 1);

    spawners.forEach((sp) => sp.event.emit("allActorsWereRemoved", world, []));

    expect(ev).toBeCalledWith(world);
  });

  it("emit event when all active spawners were finished while paused", () => {
    const world = new worldMockClass();
    const spawners = new Array(10).fill(0).map(() => {
      const sp = new ActorsSpawner();
      jest.spyOn(sp, "start");
      return sp;
    });
    const asm = new ActorsSpawnerManager()
      .setActiveSpawnersLimit(2)
      .setSpawnDelay(0.2)
      .setSpawnIntervalMin(1)
      .setSpawners(spawners)
      .start(world);

    const ev = jest.fn();
    asm.event.on("pauseCompleted", ev);

    asm.notifyAddedToWorld(world);
    asm.pause(world);
    spawners[0].event.emit("allActorsWereRemoved", world, []);

    expect(ev).toBeCalledWith(world);
  });
});
