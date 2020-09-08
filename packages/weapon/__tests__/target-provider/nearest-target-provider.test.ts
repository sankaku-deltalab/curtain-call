import { EventEmitter } from "eventemitter3";
import { Vector } from "trans-vector2d";
import {
  Actor,
  World,
  Team,
  diContainer as actorDiContainer,
  ActorRole,
} from "@curtain-call/actor";
import {
  transMockClass,
  worldMockClass,
  healthMockClass,
  collisionMockClass,
} from "../mocks";
import { NearestTargetProvider } from "../../src";

const targetableActor = (): Actor => {
  return new Actor()
    .moveTo({ x: 2, y: 0 })
    .setTeam(Team.enemySide)
    .setRole(ActorRole.character)
    .initHealth(1, 1);
};

const addActorsToWorld = (world: World, actors: readonly Actor[]): void => {
  jest
    .spyOn(world, "iterateActors")
    .mockImplementation(() => new Set(actors).values());
  jest.spyOn(world, "hasActor").mockImplementation((ac) => actors.includes(ac));
};

describe("@curtain-call/contents.NearestTargetProvider", () => {
  beforeAll(() => {
    actorDiContainer.register("EventEmitter", EventEmitter);
    actorDiContainer.register("Transformation", transMockClass);
    actorDiContainer.register("FiniteResource", healthMockClass);
    actorDiContainer.register("Collision", collisionMockClass);
  });

  afterAll(() => {
    actorDiContainer.reset();
  });

  it("provide nearest Actor", () => {
    const world = new worldMockClass();
    const user = new Actor().moveTo(Vector.zero);
    const nearTargetable = targetableActor().moveTo({ x: 2, y: 0 });
    const farTargetable = targetableActor().moveTo({ x: 3, y: 0 });
    addActorsToWorld(world, [nearTargetable, farTargetable]);

    const provider = new NearestTargetProvider()
      .setTargetTeam(Team.enemySide)
      .setUser(user);

    const target = provider.getTarget(world);

    expect(target).toBe(nearTargetable);
  });

  it("provide some target while target is alive", () => {
    const world = new worldMockClass();
    const user = new Actor().moveTo(Vector.zero);
    const nearTargetable = targetableActor().moveTo({ x: 2, y: 0 });
    const farTargetable = targetableActor().moveTo({ x: 3, y: 0 });
    addActorsToWorld(world, [nearTargetable, farTargetable]);

    const provider = new NearestTargetProvider()
      .setTargetTeam(Team.enemySide)
      .setUser(user);

    const target1 = provider.getTarget(world);
    farTargetable.moveTo({ x: 1, y: 0 });
    const target2 = provider.getTarget(world);

    expect(target1).toBe(nearTargetable);
    expect(target2).toBe(nearTargetable);
  });

  it("do not provide target not in specified team", () => {
    const world = new worldMockClass();
    const user = targetableActor().moveTo(Vector.zero);
    const nearNonTargetable = targetableActor()
      .moveTo({ x: 2, y: 0 })
      .setTeam(Team.noSide);
    const farTargetable = targetableActor().moveTo({ x: 3, y: 0 });
    addActorsToWorld(world, [nearNonTargetable, farTargetable]);

    const provider = new NearestTargetProvider()
      .setTargetTeam(Team.enemySide)
      .setUser(user);

    const target = provider.getTarget(world);

    expect(target).toBe(farTargetable);
  });

  it("do not provide dead target", () => {
    const world = new worldMockClass();
    const user = targetableActor().moveTo(Vector.zero);
    const nearNonTargetable = targetableActor().moveTo({ x: 2, y: 0 });
    jest.spyOn(nearNonTargetable, "isDead").mockReturnValue(true);
    const farTargetable = targetableActor().moveTo({ x: 3, y: 0 });
    addActorsToWorld(world, [nearNonTargetable, farTargetable]);

    const provider = new NearestTargetProvider()
      .setTargetTeam(Team.enemySide)
      .setUser(user);

    const target = provider.getTarget(world);

    expect(target).toBe(farTargetable);
  });

  it("do not provide removing target", () => {
    const world = new worldMockClass();
    const user = targetableActor().moveTo(Vector.zero);
    const nearNonTargetable = targetableActor()
      .moveTo({ x: 2, y: 0 })
      .reserveRemovingSelfFromWorld();
    const farTargetable = targetableActor().moveTo({ x: 3, y: 0 });
    addActorsToWorld(world, [nearNonTargetable, farTargetable]);

    const provider = new NearestTargetProvider()
      .setTargetTeam(Team.enemySide)
      .setUser(user);

    const target = provider.getTarget(world);

    expect(target).toBe(farTargetable);
  });
});
