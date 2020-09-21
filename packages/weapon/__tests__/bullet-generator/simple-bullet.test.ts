import { EventEmitter } from "eventemitter3";
import { Matrix } from "trans-vector2d";
import {
  Actor,
  Team,
  diContainer as actorDiContainer,
  PositionInAreaStatus,
} from "@curtain-call/actor";
import {
  transMockClass,
  worldMockClass,
  healthMockClass,
  collisionMockClass,
  localConstantMoverMockClass,
  rectCollisionShapeMockClass,
} from "../mocks";
import {
  SimpleBullet,
  LocalConstantMover,
  RectCollisionShape,
  diContainer as weaponDiContainer,
} from "../../src";

const containers = [actorDiContainer, weaponDiContainer];

const victimMock = (): Actor => {
  const victim = new Actor();
  jest.spyOn(victim, "takeDamage");
  return victim;
};

const createBullet = (): {
  bullet: SimpleBullet;
  mover: LocalConstantMover;
  collisionShape: RectCollisionShape;
} => {
  const mover = new localConstantMoverMockClass();
  const collisionShape = new rectCollisionShapeMockClass();
  const bullet = new SimpleBullet(
    new EventEmitter<{}>(),
    new transMockClass(),
    new healthMockClass(),
    new collisionMockClass(),
    mover,
    collisionShape
  );
  return {
    bullet,
    mover,
    collisionShape,
  };
};

const createInitArgs = (): {
  trans: Matrix;
  damage: number;
  damageName: string;
  lifeTimeSec: number;
  size: number;
  speed: number;
} => {
  return {
    trans: Matrix.identity,
    damage: 1,
    damageName: "testDamage",
    lifeTimeSec: 2,
    size: 64,
    speed: 7,
  };
};

describe("@curtain-call/contents.SimpleBullet", () => {
  beforeAll(() => {
    containers.forEach((c) => {
      c.register("EventEmitter", EventEmitter);
      c.register("Transformation", transMockClass);
      c.register("FiniteResource", healthMockClass);
      c.register("Collision", collisionMockClass);
    });
  });

  afterAll(() => {
    containers.forEach((c) => {
      c.reset();
    });
  });
  it("could be initialized", () => {
    const { collisionShape, bullet } = createBullet();
    const initArgs = createInitArgs();
    bullet.init(initArgs);

    expect(bullet.getTransformation().setLocal).toBeCalledWith(initArgs.trans);
    expect(collisionShape.setSize).toBeCalledWith({ x: 64, y: 64 });
  });

  it("move with local constant mover", () => {
    const initArgs = createInitArgs();
    const { bullet, mover } = createBullet();
    bullet.init(initArgs);
    jest.spyOn(mover, "update").mockReturnValue({
      done: false,
      newTrans: Matrix.translation({ x: 1, y: 2 }),
    });

    const world = new worldMockClass();
    bullet.update(world, 0.5);

    expect(bullet.getTransformation().setLocal).toBeCalledWith(
      Matrix.translation({ x: 1, y: 2 })
    );
  });

  it("would be set lifetime when initialized", () => {
    const { bullet } = createBullet();
    jest.spyOn(bullet, "setLifeTime");

    const initArgs = createInitArgs();
    bullet.init(initArgs);

    expect(bullet.setLifeTime).toBeCalledWith(initArgs.lifeTimeSec);
  });

  it("remove self if bullet is not in visible area", () => {
    const world = new worldMockClass();
    jest
      .spyOn(world.getCamera(), "calcVisibilityStatus")
      .mockReturnValue(PositionInAreaStatus.outOfArea);

    const { bullet } = createBullet();

    expect(bullet.shouldBeRemovedFromWorld(world)).toBe(true);
  });

  it("deal damage when hit to enemy", () => {
    const { bullet } = createBullet();
    const initArgs = createInitArgs();
    bullet.init(initArgs);

    const world = new worldMockClass();
    const victim = victimMock().setTeam(Team.enemySide);
    jest
      .spyOn(victim, "takeDamage")
      .mockReturnValue({ actualDamage: 1, died: false });
    bullet.notifyOverlappedWith(world, new Set([victim]));

    expect(victim.takeDamage).toBeCalledWith(world, initArgs.damage, bullet, {
      name: initArgs.damageName,
    });
  });

  it("would be removed after hit", () => {
    const { bullet } = createBullet();
    const initArgs = createInitArgs();
    bullet.init(initArgs);

    const world = new worldMockClass();
    const victim = victimMock().setTeam(Team.enemySide);
    jest
      .spyOn(victim, "takeDamage")
      .mockReturnValue({ actualDamage: 1, died: false });
    bullet.notifyOverlappedWith(world, new Set([victim]));

    expect(bullet.shouldBeRemovedFromWorld(world)).toBe(true);
  });

  it("can clear for reuse self", () => {
    const { bullet } = createBullet();
    jest.spyOn(bullet.event, "removeAllListeners");
    jest.spyOn(bullet, "cancelRemovingSelfFromWorld");

    bullet.clearSelfForReuse();

    expect(bullet.event.removeAllListeners).toBeCalled();
    expect(bullet.cancelRemovingSelfFromWorld).toBeCalled();
  });

  it("can hit after reused", () => {
    const { bullet } = createBullet();
    const initArgs = createInitArgs();
    bullet.init(initArgs);

    bullet.clearSelfForReuse();
    bullet.init(initArgs);

    const world = new worldMockClass();
    const victim = victimMock();
    jest
      .spyOn(victim, "takeDamage")
      .mockReturnValue({ actualDamage: 1, died: false });
    bullet.notifyOverlappedWith(world, new Set([victim]));

    expect(victim.takeDamage).toBeCalledWith(world, initArgs.damage, bullet, {
      name: initArgs.damageName,
    });
  });
});
