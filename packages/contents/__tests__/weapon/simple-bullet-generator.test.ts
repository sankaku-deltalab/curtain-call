import { Matrix } from "trans-vector2d";
import { World } from "@curtain-call/world";
import { SimpleBullet, SimpleBulletGenerator } from "../../src";
import { GuntreeWeapon } from "@curtain-call/weapon";
import { Actor } from "@curtain-call/actor";

const generateParams = (): Map<string, number> =>
  new Map([
    ["speed", 100],
    ["lifeTime", 4],
    ["damage", 10],
    ["size", 64],
  ]);

const generateTexts = (): Map<string, string> =>
  new Map([["damageName", "testDamage"]]);

describe("@curtain-call/contents.SimpleBulletGenerator", () => {
  it("use given bullets", () => {
    const bullet1 = new SimpleBullet();
    const bullet2 = new SimpleBullet();
    const generator = new SimpleBulletGenerator([bullet2, bullet1]);

    const world = new World();
    jest.spyOn(world, "addActor");
    const weapon = new GuntreeWeapon<World, Actor<World>>();
    const gen = (): SimpleBullet | undefined =>
      generator.generate(
        world,
        weapon,
        Matrix.identity,
        0.25,
        generateParams(),
        generateTexts()
      );
    const generated1 = gen();
    const generated2 = gen();

    expect(generated1).toBe(bullet1);
    expect(generated2).toBe(bullet2);
  });

  it("init bullet and add to world", () => {
    const bullet1 = new SimpleBullet();
    jest.spyOn(bullet1, "init");
    const generator = new SimpleBulletGenerator([bullet1]);

    const world = new World();
    jest.spyOn(world, "addActor");
    const weapon = new GuntreeWeapon<World, Actor<World>>();
    generator.generate(
      world,
      weapon,
      Matrix.identity,
      0.25,
      generateParams(),
      generateTexts()
    );

    expect(world.addActor).toBeCalledWith(bullet1);
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
    const generator = new SimpleBulletGenerator([bullet1]);

    const world = new World();
    jest.spyOn(world, "addActor");
    const weapon = new GuntreeWeapon<World, Actor<World>>();
    const gen = (): SimpleBullet | undefined =>
      generator.generate(
        world,
        weapon,
        Matrix.identity,
        0.25,
        generateParams(),
        generateTexts()
      );
    const generated1 = gen();
    const generated2 = gen();

    expect(generated1).toBe(bullet1);
    expect(generated2).toBe(undefined);
  });

  it("reuse bullets removed from world", () => {
    const bullet1 = new SimpleBullet();
    const generator = new SimpleBulletGenerator([bullet1]);

    const world = new World();
    jest.spyOn(world, "addActor");
    const weapon = new GuntreeWeapon<World, Actor<World>>();
    const gen = (): SimpleBullet | undefined =>
      generator.generate(
        world,
        weapon,
        Matrix.identity,
        0.25,
        generateParams(),
        generateTexts()
      );
    const generated1 = gen();
    world.removeActor(bullet1);

    const generated2 = gen();

    expect(generated1).toBe(bullet1);
    expect(generated2).toBe(bullet1);
  });
});
