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
): { actors: IActor[]; actorToBullet: Map<IActor, SimpleBullet> } => {
  const bullets = new Array(num).fill(0).map(() => {
    const b = new SimpleBullet();
    jest.spyOn(b, "init");
    return b;
  });

  const actors = bullets.map((b) => {
    const ac = createActorMock();
    jest.spyOn(ac, "getOneExtension").mockReturnValue(b);
    jest.spyOn(ac, "notifyRemovedFromWorld").mockImplementation((w) => {
      ac.event.emit("removedFromWorld", w);
    });
    b.notifyAddedToActor(ac);
    return ac;
  });

  const actorToBullet = new Map(
    actors.map((ac) => {
      const b = ac.getOneExtension(SimpleBullet.isSimpleBullet);
      if (!b) throw new Error("Bullet is not in actor at test");
      return [ac, b];
    })
  );
  return { actors, actorToBullet };
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

  it("use given bullets", () => {
    const { actors } = createBullets(2);
    const generator = new SimpleBulletGenerator(actors);

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

    expect(generated1).toBe(actors[1]);
    expect(generated2).toBe(actors[0]);
  });

  it("init bullet and add to world", () => {
    const { actors, actorToBullet } = createBullets(1);
    const generator = new SimpleBulletGenerator(actors);

    const world = new worldMockClass();
    const weaponParent = new actorInterfaceMockClass();
    generator.generate(
      world,
      weaponParent,
      Matrix.identity,
      0.25,
      generateParams(),
      generateTexts()
    );

    expect(world.addActor).toBeCalledWith(actors[0]);
    expect(actorToBullet.get(actors[0])?.init).toBeCalledWith({
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
    const { actors } = createBullets(1);
    const generator = new SimpleBulletGenerator(actors);

    const world = new worldMockClass();
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

    expect(generated1).toBe(actors[0]);
    expect(generated2).toBe(undefined);
  });

  it("reuse bullets removed from world", () => {
    const { actors } = createBullets(1);
    const generator = new SimpleBulletGenerator(actors);

    const world = new worldMockClass();
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

    expect(generated1).toBe(actors[0]);
    expect(generated2).toBe(actors[0]);
  });
});
