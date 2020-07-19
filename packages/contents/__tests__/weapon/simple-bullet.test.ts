import { Matrix } from "trans-vector2d";
import { World } from "@curtain-call/world";
import { RectCollisionShape } from "@curtain-call/collision";
import { SimpleBullet, Character } from "../../src";
import { RelativeMover } from "@curtain-call/mover";
import { Team } from "@curtain-call/util";

const victimMock = (): Character => {
  const victim = new Character();
  jest.spyOn(victim, "takeDamage");
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

    expect(bullet.getWorldTransform()).toEqual(initArgs.trans);
    expect(collisionShape.getBox2Ds()).toEqual([[-32, -32, 32, 32]]);
  });

  it("move with constant speed", () => {
    const world = new World();
    const victim = victimMock().setTeam(Team.enemySide);
    const { initArgs, bullet } = createInitializedBullet();
    world.addActor(victim).addActor(bullet);

    bullet.update(world, 0.5);

    expect(bullet.getWorldTransform().decompose().translation).toEqual({
      x: initArgs.speed / 2,
      y: 0,
    });
  });

  it("remove self when life time finished", () => {
    const world = new World();
    const { initArgs, bullet } = createInitializedBullet();
    world.addActor(bullet);

    bullet.update(world, initArgs.lifeTimeSec / 2);
    bullet.update(world, initArgs.lifeTimeSec / 2);

    expect(bullet.shouldRemoveSelfFromWorld(world)).toBe(true);
  });

  it.each`
    radius | shouldRemove
    ${0.9} | ${true}
    ${1.1} | ${false}
  `(
    "remove self if bullet is not in visible area",
    ({ radius, shouldRemove }) => {
      const world = new World().setDrawArea(
        { x: 0, y: 0 },
        { x: 300, y: 400 },
        1
      );
      const { bullet } = createInitializedBullet();
      bullet.setVisualRadius(radius).moveTo({ x: 151, y: 201 });
      world.addActor(bullet);

      expect(bullet.shouldRemoveSelfFromWorld(world)).toBe(shouldRemove);
    }
  );

  it("deal damage when hit to enemy", () => {
    const world = new World();
    const victim = victimMock().setTeam(Team.enemySide);
    const { initArgs, bullet } = createInitializedBullet();
    world.addActor(victim).addActor(bullet);

    bullet.notifyOverlappedWith(world, new Set([victim]));

    expect(victim.takeDamage).toBeCalledWith(world, initArgs.damage, bullet, {
      name: initArgs.damageName,
    });
  });

  it("would be removed after hit", () => {
    const world = new World();
    const victim = victimMock().setTeam(Team.enemySide);
    const { bullet } = createInitializedBullet();
    world.addActor(victim).addActor(bullet);

    bullet.notifyOverlappedWith(world, new Set([victim]));

    expect(bullet.shouldRemoveSelfFromWorld(world)).toBe(true);
  });
});
