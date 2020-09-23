import EventEmitter from "eventemitter3";
import { Actor, diContainer as actorDiContainer } from "@curtain-call/actor";
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

const actorMock = (): Actor => {
  const actor = actorDiContainer.resolve(Actor);
  jest.spyOn(actor, "setLocalTransform");
  return actor;
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
    const spawners = new Array(10).fill(0).map(() => {
      const sp = new ActorsSpawner();
      jest.spyOn(sp, "start");
      return sp;
    });
    const spawnerActors = spawners.map(() => actorMock());
    const actorGenerator = jest.fn();
    spawnerActors.forEach((ac) => actorGenerator.mockReturnValueOnce(ac));
    const asm = new ActorsSpawnerManager()
      .setActiveSpawnersLimit(2)
      .setSpawnDelay(0.2)
      .setSpawnIntervalMin(1)
      .setActorGenerator(actorGenerator)
      .setSpawners(spawners)
      .start(world);
    const parent = actorMock().addExtension(asm);

    // TODO: Extensionをremoveできるようにして、spawnerは自分のactorにaddし、終わったらremoveするか？
    // いや、将来spawnerがactorの状態に依存するようになるかもしれないので、actorを作ったほうがよさそう。
    // ならactorを作る関数をmanagerに渡すか？

    expect(world.addActor).toBeCalledTimes(1);
    expect(world.addActor).toBeCalledWith(spawnerActors[0]);
    expect(spawners[0].start).toBeCalledWith(world);

    asm.update(world, parent, 1);

    expect(world.addActor).toBeCalledTimes(2);
    expect(world.addActor).toBeCalledWith(spawnerActors[1]);
    expect(spawners[1].start).toBeCalledWith(world);

    spawners[1].event.emit("allActorsWereRemoved", world, []);
    asm.update(world, parent, 1);

    expect(world.addActor).toBeCalledTimes(3);
    expect(world.addActor).toBeCalledWith(spawnerActors[2]);
    expect(spawners[2].start).toBeCalledWith(world);

    asm.update(world, parent, 1);
    spawners[2].event.emit("allActorsWereRemoved", world, []);
    asm.update(world, parent, 0.2);

    expect(world.addActor).toBeCalledTimes(4);
    expect(world.addActor).toBeCalledWith(spawnerActors[3]);
    expect(spawners[3].start).toBeCalledWith(world);

    asm.update(world, parent, 2);

    expect(world.addActor).toBeCalledTimes(4);
  });

  it("can pause", () => {
    const world = new worldMockClass();
    const spawners = new Array(10).fill(0).map(() => {
      const sp = new ActorsSpawner();
      jest.spyOn(sp, "start");
      return sp;
    });
    const spawnerActors = spawners.map(() => actorMock());
    const actorGenerator = jest.fn();
    spawnerActors.forEach((ac) => actorGenerator.mockReturnValueOnce(ac));
    const asm = new ActorsSpawnerManager()
      .setActiveSpawnersLimit(2)
      .setSpawnDelay(0.2)
      .setSpawnIntervalMin(1)
      .setActorGenerator(actorGenerator)
      .setSpawners(spawners)
      .start(world);
    const parent = actorMock().addExtension(asm);

    expect(world.addActor).toBeCalledTimes(1);
    expect(world.addActor).toBeCalledWith(spawnerActors[0]);
    expect(spawners[0].start).toBeCalledWith(world);

    asm.pause(world);
    asm.update(world, parent, 1);

    expect(world.addActor).toBeCalledTimes(1);

    asm.start(world);
    asm.update(world, parent, 1);

    expect(world.addActor).toBeCalledTimes(2);
    expect(world.addActor).toBeCalledWith(spawnerActors[1]);
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
    const parent = actorMock().addExtension(asm);

    const ev = jest.fn();
    asm.event.on("allSpawnersWereFinished", ev);

    asm.update(world, parent, 1);

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
    const _parent = actorMock().addExtension(asm);

    const ev = jest.fn();
    asm.event.on("pauseCompleted", ev);

    asm.pause(world);
    spawners[0].event.emit("allActorsWereRemoved", world, []);

    expect(ev).toBeCalledWith(world);
  });
});
