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
  scene: T
): {
  scene: T;
  guntree: gt.Gun;
  muzzles: Map<string, Transformation>;
  bulletGenerator: BulletGenerator<T, A>;
  targetDealer: TargetDealer<T>;
  damageDealer: DamageDealer<T>;
} => ({
  scene,
  guntree: exampleGun(),
  muzzles: new Map([["center", new Transformation()]]),
  bulletGenerator: bulletGeneratorMock(),
  targetDealer: targetDealerMock(),
  damageDealer: damageDealerMock(),
});

describe("@curtain-call/weapon.GunTreeWeapon", () => {
  describe("can fire", () => {
    it("can start firing", () => {
      const scene = {};
      const bullet = {};
      const weapon = new GunTreeWeapon<typeof scene, typeof bullet>();

      const args = startArgsMock<typeof scene, typeof bullet>(scene);
      weapon.start(args);

      expect(args.bulletGenerator.generate).toBeCalledWith(
        scene,
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
      const scene = {};
      const bullet = {};
      const weapon = new GunTreeWeapon<typeof scene, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = startArgsMock<typeof scene, typeof bullet>(scene);
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.start(args);
      expect(weapon.event.emit).toBeCalledWith("fired", scene, bullet);

      weapon.update(scene, 60);
      expect(weapon.event.emit).toBeCalledWith("finished", scene);
    });

    it("can stop firing", () => {
      const scene = {};
      const bullet = {};
      const weapon = new GunTreeWeapon<typeof scene, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = startArgsMock<typeof scene, typeof bullet>(scene);
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.start(args);
      weapon.stop();

      weapon.update(scene, 60);
      expect(weapon.event.emit).toBeCalledWith("finished", scene);
      expect(weapon.isFiring()).toBe(false);
    });

    it("can stop firing", () => {
      const scene = {};
      const bullet = {};
      const weapon = new GunTreeWeapon<typeof scene, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = startArgsMock<typeof scene, typeof bullet>(scene);
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.start(args);
      weapon.stop();

      weapon.update(scene, 60);
      expect(weapon.event.emit).toBeCalledWith("finished", scene);
      expect(weapon.isFiring()).toBe(false);
    });

    it("can stop firing immediately", () => {
      const scene = {};
      const bullet = {};
      const weapon = new GunTreeWeapon<typeof scene, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = startArgsMock<typeof scene, typeof bullet>(scene);
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.start(args);
      weapon.forceStop();

      expect(weapon.isFiring()).toBe(false);
    });
  });
});
