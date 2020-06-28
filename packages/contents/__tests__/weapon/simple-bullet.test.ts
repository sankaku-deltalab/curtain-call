import { Matrix } from "trans-vector2d";
import { World } from "@curtain-call/world";
import { RectCollisionShape } from "@curtain-call/collision";
import { SimpleBullet, Character, Team } from "../../src";
import { RelativeMover } from "@curtain-call/mover";

const victimMock = (): Character => {
  const victim = new Character();
  jest.spyOn(victim.health, "takeDamage");
  return victim;
};

const createInitializedBullet = <TWorld>(): {
  initArgs: {
    trans: Matrix;
    damage: number;
    damageName: string;
    lifeTimeSec: number;
    size: number;
    speed: number;
  };
  bullet: SimpleBullet;
  mover: RelativeMover<TWorld>;
  collisionShape: RectCollisionShape;
} => {
  const initArgs = {
    trans: Matrix.identity,
    damage: 1,
    damageName: "testDamage",
    lifeTimeSec: 2,
    size: 64,
    speed: 7,
  };
  const mover = new RelativeMover();
  const collisionShape = new RectCollisionShape();
  const bullet = new SimpleBullet({ mover, collisionShape }).init(initArgs);
  return {
    initArgs,
    bullet,
    mover,
    collisionShape,
  };
};

describe("@curtain-call/contents.SimpleBullet", () => {
  it("could be initialized", () => {
    const { initArgs, collisionShape, bullet } = createInitializedBullet();

    expect(bullet.trans.getLocal()).toEqual(initArgs.trans);
    expect(collisionShape.getBox2Ds()).toEqual([[-32, -32, 32, 32]]);
  });

  it("move with constant speed", () => {
    const world = new World();
    const victim = victimMock().inTeam(Team.enemySide);
    const { initArgs, bullet } = createInitializedBullet();
    world.addActor(victim).addActor(bullet);

    bullet.update(world, 0.5);

    expect(bullet.trans.getLocal().decompose().translation).toEqual({
      x: initArgs.speed / 2,
      y: 0,
    });
  });

  it("remove self when life time finished", () => {
    const world = new World();
    const victim = victimMock().inTeam(Team.enemySide);
    const { initArgs, bullet } = createInitializedBullet();
    world.addActor(victim).addActor(bullet);

    bullet.update(world, initArgs.lifeTimeSec / 2);
    bullet.update(world, initArgs.lifeTimeSec / 2);

    expect(bullet.shouldRemoveSelfFromWorld(world)).toBe(true);
  });

  it("deal damage when hit to enemy", () => {
    const world = new World();
    const victim = victimMock().inTeam(Team.enemySide);
    const { initArgs, bullet } = createInitializedBullet();
    world.addActor(victim).addActor(bullet);

    bullet.collision.notifyOverlappedWith(world, new Set([victim.collision]));

    expect(victim.health.takeDamage).toBeCalledWith(
      world,
      initArgs.damage,
      bullet.damageDealer,
      { name: initArgs.damageName }
    );
  });

  it("would be removed after hit", () => {
    const world = new World();
    const victim = victimMock().inTeam(Team.enemySide);
    const { bullet } = createInitializedBullet();
    world.addActor(victim).addActor(bullet);

    bullet.collision.notifyOverlappedWith(world, new Set([victim.collision]));

    expect(bullet.shouldRemoveSelfFromWorld(world)).toBe(true);
  });
});
