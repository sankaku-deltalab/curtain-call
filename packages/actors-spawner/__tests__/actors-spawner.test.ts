import { Matrix } from "trans-vector2d";
import { Actor } from "@curtain-call/actor";
import { World } from "@curtain-call/world";
import { Transformation } from "@curtain-call/util";
import { BasicDamageDealer } from "@curtain-call/health";
import { ActorsSpawner } from "../src";

const actorMock = (): Actor<World> => {
  const actor = new Actor<World>();
  jest.spyOn(actor, "setLocalTransform");
  return actor;
};

const setupSpawner = (
  spawner: ActorsSpawner
): {
  baseActor: Actor<World>;
  actors: Actor<World>[];
  spawning: jest.Mock;
  schedule: [Matrix, number][];
  world: World;
} => {
  const baseActor = new Actor<World>();
  jest.spyOn(baseActor, "removeSelfFromWorld");
  const actors = [actorMock(), actorMock(), actorMock(), actorMock()];
  const spawning = jest.fn().mockImplementation((i) => actors[i]);
  const schedule: [Matrix, number][] = [
    [Matrix.identity, 0],
    [Matrix.translation({ x: 1, y: 2 }), 0.5],
    [Matrix.translation({ x: 3, y: 4 }), 0.5],
    [Matrix.translation({ x: 5, y: 6 }), 1.2],
  ];
  spawner
    .setSpawningFunction(spawning)
    .setSchedule(schedule)
    .possessTo(baseActor);

  const world = new World();
  jest.spyOn(world, "addActor");
  world.addActor(baseActor);
  return { baseActor, actors, spawning, schedule, world };
};

describe("@curtain-call/actors-spawner", () => {
  it("is not sub-class of Actor", () => {
    const spawner = new ActorsSpawner();
    expect(spawner).not.toBeInstanceOf(Actor);
  });

  describe("possess to Actor", () => {
    it("attach to actor when possessed", () => {
      const baseActor = new Actor<World>();
      jest.spyOn(baseActor, "attachTransformation");
      const trans = new Transformation();

      const _spawner = new ActorsSpawner(trans).possessTo(baseActor);

      expect(baseActor.attachTransformation).toBeCalledWith(trans);
    });

    it("update when actor updated", () => {
      const actor = new Actor<World>();
      const trans = new Transformation();
      const spawner = new ActorsSpawner(trans).possessTo(actor);
      jest.spyOn(spawner, "update");

      const world = new World();
      const deltaSec = 123;
      actor.update(world, deltaSec);

      expect(spawner.update).toBeCalledWith(world, deltaSec);
    });

    it("remove possessed actor when finished", () => {
      const spawner = new ActorsSpawner();
      const { baseActor, world } = setupSpawner(spawner);

      spawner.start(world);
      expect(baseActor.removeSelfFromWorld).not.toBeCalled();

      spawner.update(world, 10);
      expect(baseActor.removeSelfFromWorld).toBeCalledWith(true);
    });
  });

  it("spawn actors with given transformation and times", () => {
    const spawner = new ActorsSpawner();
    const { actors, world, spawning, schedule } = setupSpawner(spawner);

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
    const spawner = new ActorsSpawner();
    const { world, spawning } = setupSpawner(spawner);

    spawner.update(world, 10);
    expect(spawning).not.toBeCalled();
  });

  it("emit event when all spawned actors were dead", () => {
    const spawner = new ActorsSpawner();
    const { actors, world } = setupSpawner(spawner);

    const deadEvent = jest.fn();
    spawner.event.on("allActorsWereDead", deadEvent);

    spawner.start(world);
    spawner.update(world, 10);

    const deadActors = [2, 1, 0, 3].map((i) => actors[i]);
    deadActors.forEach((ac) =>
      ac.kill(world, new BasicDamageDealer(), { name: "testDamage" })
    );

    expect(deadEvent).toBeCalledWith(deadActors);
  });

  it("emit event when all spawned actors were removed from world", () => {
    const spawner = new ActorsSpawner();
    const { actors, world } = setupSpawner(spawner);

    const removedEvent = jest.fn();
    spawner.event.on("allActorsWereRemoved", removedEvent);

    spawner.start(world);
    spawner.update(world, 10);

    const removedActors = [2, 1, 0, 3].map((i) => actors[i]);
    removedActors.forEach((ac) => world.removeActor(ac));

    expect(removedEvent).toBeCalledWith(removedActors);
  });

  it("do not emit event if possessed actor was removed", () => {
    const spawner = new ActorsSpawner();
    const { baseActor, actors, world } = setupSpawner(spawner);

    const deadEvent = jest.fn();
    spawner.event.on("allActorsWereDead", deadEvent);
    const removedEvent = jest.fn();
    spawner.event.on("allActorsWereRemoved", removedEvent);

    spawner.start(world);

    baseActor.notifyRemovedFromWorld(world);
    spawner.update(world, 10);

    const deadActors = [2, 1, 0, 3].map((i) => actors[i]);
    deadActors.forEach((ac) =>
      ac.kill(world, new BasicDamageDealer(), { name: "testDamage" })
    );

    expect(deadEvent).not.toBeCalled();
  });
});
