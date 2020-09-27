import { EventEmitter } from "eventemitter3";
import { Matrix } from "trans-vector2d";
import {
  Actor,
  Team,
  diContainer as actorDiContainer,
  PositionInAreaStatus,
  IActor,
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
  actor: IActor;
} => {
  const mover = new localConstantMoverMockClass();
  const collisionShape = new rectCollisionShapeMockClass();
  const bullet = new SimpleBullet(mover, collisionShape);
  const actor = new Actor().addExtension(bullet);
  return {
    bullet,
    mover,
    collisionShape,
    actor,
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
    const { collisionShape, bullet, actor } = createBullet();
    const initArgs = createInitArgs();
    bullet.init(initArgs);

    expect(actor.getTransformation().setLocal).toBeCalledWith(initArgs.trans);
    expect(collisionShape.setSize).toBeCalledWith({ x: 64, y: 64 });
  });

  it("move with local constant mover", () => {
    const mover = new localConstantMoverMockClass();
    const collisionShape = new rectCollisionShapeMockClass();
    const bullet = new SimpleBullet(mover, collisionShape);
    const actor = new Actor();
    jest.spyOn(actor, "addMover");
    actor.addExtension(bullet);

    expect(actor.addMover).toBeCalledWith(mover);
  });

  it("would be set lifetime when initialized", () => {
    const { bullet, actor } = createBullet();
    jest.spyOn(actor, "setLifeTime");

    const initArgs = createInitArgs();
    bullet.init(initArgs);

    expect(actor.setLifeTime).toBeCalledWith(initArgs.lifeTimeSec);
  });

  it("remove self if bullet is not in visible area", () => {
    const world = new worldMockClass();
    jest
      .spyOn(world.getCamera(), "calcVisibilityStatus")
      .mockReturnValue(PositionInAreaStatus.outOfArea);

    const { bullet, actor } = createBullet();

    expect(bullet.shouldBeRemovedFromWorld(world, actor)).toBe(true);
  });

  it("deal damage when hit to enemy", () => {
    const { bullet, actor } = createBullet();
    const initArgs = createInitArgs();
    bullet.init(initArgs);

    const world = new worldMockClass();
    const victim = victimMock().setTeam(Team.enemySide);
    jest
      .spyOn(victim, "takeDamage")
      .mockReturnValue({ actualDamage: 1, died: false });
    actor.notifyOverlappedWith(world, new Set([victim]));

    expect(victim.takeDamage).toBeCalledWith(world, initArgs.damage, actor, {
      name: initArgs.damageName,
    });
  });

  it("would be removed after hit", () => {
    const { bullet, actor } = createBullet();
    const initArgs = createInitArgs();
    bullet.init(initArgs);

    const world = new worldMockClass();
    const victim = victimMock().setTeam(Team.enemySide);
    jest
      .spyOn(victim, "takeDamage")
      .mockReturnValue({ actualDamage: 1, died: false });
    actor.notifyOverlappedWith(world, new Set([victim]));

    expect(bullet.shouldBeRemovedFromWorld(world, actor)).toBe(true);
  });

  it("can clear for reuse self", () => {
    const { bullet, actor } = createBullet();
    jest.spyOn(actor.event, "removeAllListeners");
    jest.spyOn(actor, "cancelRemovingSelfFromWorld");

    bullet.clearSelfForReuse();

    expect(actor.event.removeAllListeners).toBeCalled();
    expect(actor.cancelRemovingSelfFromWorld).toBeCalled();
  });

  it("can hit after reused", () => {
    const { bullet, actor } = createBullet();
    const initArgs = createInitArgs();
    bullet.init(initArgs);

    bullet.clearSelfForReuse();
    bullet.init(initArgs);

    const world = new worldMockClass();
    const victim = victimMock();
    jest
      .spyOn(victim, "takeDamage")
      .mockReturnValue({ actualDamage: 1, died: false });
    actor.notifyOverlappedWith(world, new Set([victim]));

    expect(victim.takeDamage).toBeCalledWith(world, initArgs.damage, actor, {
      name: initArgs.damageName,
    });
  });
});
