import { World } from "@curtain-call/world";
import { guntree as gt, NonTargetProvider } from "@curtain-call/weapon";
import { Character, SimpleEnemyPlan, SimpleBulletGenerator } from "../../src";

const worldMock = (): World => {
  return new World()
    .setDrawArea({ x: 0, y: 0 }, { x: 40, y: 20 }, 1)
    .setCoreArea({ x: -10, y: -20 }, { x: 10, y: 20 });
};

const gunMock = (): gt.Gun => {
  return gt.repeat({ interval: 1, times: 1 }, gt.nop());
};

const characterMock = (): Character => {
  return new Character().initWeapon({
    guntree: gunMock(),
    muzzles: new Map(),
    bulletGenerator: new SimpleBulletGenerator([]),
    targetProvider: new NonTargetProvider(),
  });
};

describe("@curtain-call/contents.SimpleEnemyPlan", () => {
  it.each`
    prevInCoreArea | prevInVisualArea
    ${false}       | ${false}
    ${true}        | ${false}
    ${false}       | ${true}
  `(
    "when character entered to core and visual area, character start firing",
    ({ prevInCoreArea, prevInVisualArea }) => {
      const world = worldMock();
      const character = characterMock().plannedBy(new SimpleEnemyPlan());
      jest.spyOn(character.weapon, "start");

      if (!prevInCoreArea && !prevInVisualArea)
        character.moveTo({ x: 15, y: 15 });
      else if (prevInCoreArea && !prevInVisualArea)
        character.moveTo({ x: 15, y: 5 });
      else if (!prevInCoreArea && prevInVisualArea)
        character.moveTo({ x: 5, y: 15 });

      world.addActor(character);

      character.moveTo({ x: 5, y: 5 });

      world.update(0.125);

      expect(character.weapon.start).toBeCalledWith(world);
    }
  );

  it.each`
    nextInCoreArea | nextInVisualArea
    ${false}       | ${false}
    ${true}        | ${false}
    ${false}       | ${true}
  `(
    "when character exit from out of area, character was removed and stop firing",
    ({ nextInCoreArea, nextInVisualArea }) => {
      const world = worldMock();
      const character = characterMock()
        .plannedBy(new SimpleEnemyPlan())
        .moveTo({ x: 5, y: 5 });
      jest.spyOn(character.weapon, "stop");
      jest.spyOn(character, "removeSelfFromWorld");

      world.addActor(character);
      world.update(0.125);

      if (!nextInCoreArea && !nextInVisualArea)
        character.moveTo({ x: 15, y: 15 });
      else if (nextInCoreArea && !nextInVisualArea)
        character.moveTo({ x: 15, y: 5 });
      else if (!nextInCoreArea && nextInVisualArea)
        character.moveTo({ x: 5, y: 15 });

      world.update(0.125);

      expect(character.weapon.stop).toBeCalled();
      expect(character.removeSelfFromWorld).toBeCalled();
    }
  );
});
