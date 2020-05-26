import * as gt from "guntree";
import { GunTreeWeapon, BulletGenerator, TargetDealer } from "../src";
import { Transformation } from "@curtain-call/util";
import { DamageDealer } from "@curtain-call/health";

const exampleGun = (): gt.Gun => {
  return gt.concat(gt.useMuzzle("center"), gt.fire(gt.bullet()), gt.wait(60));
};

const bulletGeneratorMock = <T, A>(): BulletGenerator<T, A> => {
  const cls = jest.fn(() => ({ generate: jest.fn() }));
  return new cls();
};

const targetDealerMock = <T>(): TargetDealer<T> => {
  const cls = jest.fn(() => ({ get: jest.fn() }));
  return new cls();
};

const damageDealerMock = <T>(): DamageDealer<T> => {
  const dd = new DamageDealer<T>();
  jest.spyOn(dd.event, "emit");
  jest.spyOn(dd.event, "on");
  return dd;
};

const startArgsMock = <T, A>(
  world: T
): {
  world: T;
  guntree: gt.Gun;
  muzzles: Map<string, Transformation>;
  bulletGenerator: BulletGenerator<T, A>;
  targetDealer: TargetDealer<T>;
  damageDealer: DamageDealer<T>;
} => ({
  world,
  guntree: exampleGun(),
  muzzles: new Map([["center", new Transformation()]]),
  bulletGenerator: bulletGeneratorMock(),
  targetDealer: targetDealerMock(),
  damageDealer: damageDealerMock(),
});

describe("@curtain-call/weapon.GunTreeWeapon", () => {
  describe("can fire", () => {
    it("can start firing", () => {
      const world = {};
      const bullet = {};
      const weapon = new GunTreeWeapon<typeof world, typeof bullet>();

      const args = startArgsMock<typeof world, typeof bullet>(world);
      weapon.start(args);

      expect(args.bulletGenerator.generate).toBeCalledWith(
        world,
        weapon,
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
      const world = {};
      const bullet = {};
      const weapon = new GunTreeWeapon<typeof world, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = startArgsMock<typeof world, typeof bullet>(world);
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.start(args);
      expect(weapon.event.emit).toBeCalledWith("fired", world, bullet);

      weapon.update(world, 60);
      expect(weapon.event.emit).toBeCalledWith("finished", world);
    });

    it("can stop firing", () => {
      const world = {};
      const bullet = {};
      const weapon = new GunTreeWeapon<typeof world, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = startArgsMock<typeof world, typeof bullet>(world);
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.start(args);
      weapon.stop();

      weapon.update(world, 60);
      expect(weapon.event.emit).toBeCalledWith("finished", world);
      expect(weapon.isFiring()).toBe(false);
    });

    it("can stop firing", () => {
      const world = {};
      const bullet = {};
      const weapon = new GunTreeWeapon<typeof world, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = startArgsMock<typeof world, typeof bullet>(world);
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.start(args);
      weapon.stop();

      weapon.update(world, 60);
      expect(weapon.event.emit).toBeCalledWith("finished", world);
      expect(weapon.isFiring()).toBe(false);
    });

    it("can stop firing immediately", () => {
      const world = {};
      const bullet = {};
      const weapon = new GunTreeWeapon<typeof world, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = startArgsMock<typeof world, typeof bullet>(world);
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.start(args);
      weapon.forceStop();

      expect(weapon.isFiring()).toBe(false);
    });
  });
});
