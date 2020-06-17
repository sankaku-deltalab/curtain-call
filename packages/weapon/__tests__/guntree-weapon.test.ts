import * as gt from "guntree";
import { GuntreeWeapon, BulletGenerator, TargetProvider } from "../src";
import { Transformation } from "@curtain-call/util";

const exampleGun = (): gt.Gun => {
  return gt.concat(gt.useMuzzle("center"), gt.fire(gt.bullet()), gt.wait(60));
};

const bulletGeneratorMock = <T, A>(): BulletGenerator<T, A> => {
  const cls = jest.fn(() => ({ generate: jest.fn() }));
  return new cls();
};

const targetProviderMock = <T>(): TargetProvider<T> => {
  const cls = jest.fn(() => ({ get: jest.fn() }));
  return new cls();
};

const initArgsMock = <T, A>(): {
  guntree: gt.Gun;
  muzzles: Map<string, Transformation>;
  bulletGenerator: BulletGenerator<T, A>;
  targetProvider: TargetProvider<T>;
} => ({
  guntree: exampleGun(),
  muzzles: new Map([["center", new Transformation()]]),
  bulletGenerator: bulletGeneratorMock(),
  targetProvider: targetProviderMock(),
});

describe("@curtain-call/weapon.GuntreeWeapon", () => {
  describe("can fire", () => {
    it("can start firing", () => {
      const world = {};
      const bullet = {};
      const weapon = new GuntreeWeapon<typeof world, typeof bullet>();

      const args = initArgsMock<typeof world, typeof bullet>();
      weapon.init(args).start(world);

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
      const weapon = new GuntreeWeapon<typeof world, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = initArgsMock<typeof world, typeof bullet>();
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.init(args).start(world);
      expect(weapon.event.emit).toBeCalledWith("fired", world, bullet);

      weapon.update(world, 60);
      expect(weapon.event.emit).toBeCalledWith("finished", world);
    });

    it("can stop firing", () => {
      const world = {};
      const bullet = {};
      const weapon = new GuntreeWeapon<typeof world, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = initArgsMock<typeof world, typeof bullet>();
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.init(args).start(world);
      weapon.stop();

      weapon.update(world, 60);
      expect(weapon.event.emit).toBeCalledWith("finished", world);
      expect(weapon.isFiring()).toBe(false);
    });

    it("can stop firing", () => {
      const world = {};
      const bullet = {};
      const weapon = new GuntreeWeapon<typeof world, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = initArgsMock<typeof world, typeof bullet>();
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.init(args).start(world);
      weapon.stop();

      weapon.update(world, 60);
      expect(weapon.event.emit).toBeCalledWith("finished", world);
      expect(weapon.isFiring()).toBe(false);
    });

    it("can stop firing immediately", () => {
      const world = {};
      const bullet = {};
      const weapon = new GuntreeWeapon<typeof world, typeof bullet>();
      jest.spyOn(weapon.event, "emit");

      const args = initArgsMock<typeof world, typeof bullet>();
      args.bulletGenerator.generate = jest.fn().mockReturnValue(bullet);

      weapon.init(args).start(world);
      weapon.forceStop();

      expect(weapon.isFiring()).toBe(false);
    });
  });
});
