import { EventEmitter } from "eventemitter3";
import { Matrix } from "trans-vector2d";
import { diContainer as actorDiContainer, IActor } from "@curtain-call/actor";
import {
  transMockClass,
  worldMockClass,
  healthMockClass,
  collisionMockClass,
  localConstantMoverMockClass,
  rectCollisionShapeMockClass,
  actorInterfaceMockClass,
} from "../mocks";
import {
  SimpleBullet,
  SimpleBulletGenerator,
  diContainer as weaponDiContainer,
} from "../../src";

const generateParams = (): Map<string, number> =>
  new Map([
    ["speed", 100],
    ["lifeTime", 4],
    ["damage", 10],
    ["size", 64],
  ]);

const generateTexts = (): Map<string, string> =>
  new Map([["damageName", "testDamage"]]);

const diContainers = [actorDiContainer, weaponDiContainer];

const createActorMock = (): IActor => {
  const actor = new actorInterfaceMockClass();
  jest.spyOn(actor, "addExtension").mockImplementation((b) => {
    b.notifyAddedToActor(actor);
    return actor;
  });
  return actor;
};

const createBullets = (
  num: number
): {
  bullets: SimpleBullet[];
  bulletToActor: Map<SimpleBullet, IActor>;
  bulletAndActors: [SimpleBullet, IActor][];
} => {
  const bullets = new Array(num).fill(0).map(() => new SimpleBullet());
  const bulletAndActors: [SimpleBullet, IActor][] = bullets.map((b) => [
    b,
    createActorMock(),
  ]);
  const bulletToActor = new Map(bulletAndActors);
  bullets.forEach((b) => {
    const a = bulletToActor.get(b);
    if (!a) throw new Error("test error");
    b.notifyAddedToActor(a);
  });
  return {
    bullets,
    bulletToActor,
    bulletAndActors,
  };
};

describe("@curtain-call/contents.SimpleBulletGenerator", () => {
  beforeAll(() => {
    diContainers.forEach((c) => {
      c.register("EventEmitter", EventEmitter);
      c.register("Transformation", transMockClass);
      c.register("FiniteResource", healthMockClass);
      c.register("Collision", collisionMockClass);
      c.register("LocalConstantMover", localConstantMoverMockClass);
      c.register("RectCollisionShape", rectCollisionShapeMockClass);
    });
  });

  afterAll(() => {
    diContainers.forEach((c) => {
      c.reset();
    });
  });

  it("add bullet to actor at constructed", () => {
    const { bulletAndActors } = createBullets(2);
    new SimpleBulletGenerator(bulletAndActors);

    expect(bulletAndActors.length).not.toBe(0);
    bulletAndActors.forEach(([b, a]) => {
      expect(a.addExtension).toBeCalledWith(b);
    });
  });

  it("use given bullets", () => {
    const { bulletAndActors, bulletToActor } = createBullets(2);
    const generator = new SimpleBulletGenerator(bulletAndActors);

    const world = new worldMockClass();
    jest.spyOn(world, "addActor");
    const weaponParent = new actorInterfaceMockClass();
    const gen = (): IActor | undefined =>
      generator.generate(
        world,
        weaponParent,
        Matrix.identity,
        0.25,
        generateParams(),
        generateTexts()
      );
    const generated1 = gen();
    const generated2 = gen();

    expect(generated1).toBe(bulletToActor.get(bulletAndActors[1][0]));
    expect(generated2).toBe(bulletToActor.get(bulletAndActors[0][0]));
  });

  it("init bullet and add to world", () => {
    const bullet1 = new SimpleBullet();
    const actor1 = createActorMock();
    jest.spyOn(bullet1, "init");
    const generator = new SimpleBulletGenerator([[bullet1, actor1]]);

    const world = new worldMockClass();
    jest.spyOn(world, "addActor");
    const weaponParent = new actorInterfaceMockClass();
    generator.generate(
      world,
      weaponParent,
      Matrix.identity,
      0.25,
      generateParams(),
      generateTexts()
    );

    expect(world.addActor).toBeCalledWith(actor1);
    expect(bullet1.init).toBeCalledWith({
      // trans: Matrix.from({ translation: { x: 0.25 * 100, y: 0 } }), // This trans is not usable because c is -0 not +0
      trans: new Matrix(1, 0, 0, 1, 25, 0),
      speed: 100,
      lifeTimeSec: 4,
      damage: 10,
      damageName: "testDamage",
      size: 64,
    });
  });

  it("do not deal bullet if all given bullets was used", () => {
    const bullet1 = new SimpleBullet();
    const actor1 = createActorMock();
    const generator = new SimpleBulletGenerator([[bullet1, actor1]]);

    const world = new worldMockClass();
    jest.spyOn(world, "addActor");
    const weaponParent = createActorMock();
    const gen = (): IActor | undefined =>
      generator.generate(
        world,
        weaponParent,
        Matrix.identity,
        0.25,
        generateParams(),
        generateTexts()
      );
    const generated1 = gen();
    const generated2 = gen();

    expect(generated1).toBe(actor1);
    expect(generated2).toBe(undefined);
  });

  it("reuse bullets removed from world", () => {
    const bullet1 = new SimpleBullet();
    const actor1 = createActorMock();
    jest.spyOn(actor1, "notifyRemovedFromWorld").mockImplementation((w) => {
      actor1.event.emit("removedFromWorld", w);
    });
    const generator = new SimpleBulletGenerator([[bullet1, actor1]]);

    const world = new worldMockClass();
    jest.spyOn(world, "addActor");
    const weaponParent = new actorInterfaceMockClass();
    const gen = (): IActor | undefined =>
      generator.generate(
        world,
        weaponParent,
        Matrix.identity,
        0.25,
        generateParams(),
        generateTexts()
      );
    const generated1 = gen();
    generated1?.notifyRemovedFromWorld(world);

    const generated2 = gen();

    expect(generated1).toBe(actor1);
    expect(generated2).toBe(actor1);
  });
});
