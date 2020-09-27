import { EventEmitter } from "eventemitter3";
import * as gt from "guntree";
import {
  Transformation,
  diContainer as actorDiContainer,
} from "@curtain-call/actor";
import {
  transMockClass,
  worldMockClass,
  healthMockClass,
  collisionMockClass,
  actorInterfaceMockClass,
} from "../mocks";
import { GuntreeWeapon, BulletGenerator, TargetProvider } from "../../src";

const exampleGun = (): gt.Gun => {
  return gt.concat(gt.useMuzzle("center"), gt.fire(gt.bullet()), gt.wait(60));
};

const bulletGeneratorMock = (): BulletGenerator => {
  const cls = jest.fn(() => ({ generate: jest.fn() }));
  return new cls();
};

const targetProviderMock = (): TargetProvider => {
  const cls = jest.fn(() => ({ getTarget: jest.fn() }));
  return new cls();
};

const initArgsMock = (): {
  guntree: gt.Gun;
  muzzles: Map<string, Transformation>;
  bulletGenerator: BulletGenerator;
  targetProvider: TargetProvider;
} => ({
  guntree: exampleGun(),
  muzzles: new Map([["center", new transMockClass()]]),
  bulletGenerator: bulletGeneratorMock(),
  targetProvider: targetProviderMock(),
});

describe("@curtain-call/weapon.GuntreeWeapon", () => {
  beforeAll(() => {
    actorDiContainer.register("EventEmitter", EventEmitter);
    actorDiContainer.register("Transformation", transMockClass);
    actorDiContainer.register("FiniteResource", healthMockClass);
    actorDiContainer.register("Collision", collisionMockClass);
  });

  afterAll(() => {
    actorDiContainer.reset();
  });

  describe("can fire", () => {
    it("can start firing", () => {
      const world = new worldMockClass();
      const weapon = new GuntreeWeapon();
      const parent = actorInterfaceMockClass();
      weapon.notifyAddedToActor(parent);

      const args = initArgsMock();
      weapon.init(args).startFire(world);

      expect(args.bulletGenerator.generate).toBeCalledWith(
        world,
        parent,
        args.muzzles.get("center")?.getGlobal(),
        0,
        new Map([
          ["size", 1],
          ["speed", 1],
        ]),
        new Map()
      );
    });

    it("can update firing", () => {
      const world = new worldMockClass();
      const bullet = {};
      const weapon = new GuntreeWeapon();
      const parent = actorInterfaceMockClass();
      weapon.notifyAddedToActor(parent);

      const args = initArgsMock();
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.init(args).startFire(world);
      expect(args.bulletGenerator.generate).toBeCalled();
    });

    it("can stop firing", () => {
      const world = new worldMockClass();
      const bullet = {};
      const weapon = new GuntreeWeapon();
      const parent = new actorInterfaceMockClass();
      weapon.notifyAddedToActor(parent);

      const args = initArgsMock();
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.init(args).startFire(world);
      expect(weapon.isFiring()).toBe(true);

      weapon.stopFire();

      weapon.update(world, parent, 60);
      expect(weapon.isFiring()).toBe(false);
    });

    it("can stop firing", () => {
      const world = new worldMockClass();
      const bullet = {};
      const weapon = new GuntreeWeapon();
      const parent = new actorInterfaceMockClass();
      weapon.notifyAddedToActor(parent);

      const args = initArgsMock();
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.init(args).startFire(world);
      weapon.stopFire();

      weapon.update(world, parent, 60);
      expect(weapon.isFiring()).toBe(false);
    });

    it("can stop firing immediately", () => {
      const world = new worldMockClass();
      const bullet = {};
      const weapon = new GuntreeWeapon();
      const parent = new actorInterfaceMockClass();
      weapon.notifyAddedToActor(parent);

      const args = initArgsMock();
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.init(args).startFire(world);
      weapon.forceStopFire();

      expect(weapon.isFiring()).toBe(false);
    });
  });
});
