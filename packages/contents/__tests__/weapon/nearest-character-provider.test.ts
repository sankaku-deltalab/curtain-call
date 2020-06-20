import { Matrix } from "trans-vector2d";
import { World } from "@curtain-call/world";
import { Transformation } from "@curtain-call/util";
import { NearestCharacterProvider, Character, Team } from "../../src";

const nonTargetableTeamCharacter = (): Character => {
  return new Character()
    .moveTo({ x: 0, y: 0 })
    .inTeam(Team.noSide)
    .healthInitialized(1);
};

const daedCharacter = (): Character => {
  const character = new Character()
    .moveTo({ x: 0, y: 0 })
    .inTeam(Team.enemySide)
    .healthInitialized(1);
  jest.spyOn(character.health, "isDead").mockReturnValue(true);
  return character;
};

const removingCharacter = (): Character => {
  const character = new Character()
    .moveTo({ x: 0, y: 0 })
    .inTeam(Team.enemySide);
  jest.spyOn(character, "shouldRemoveSelfFromWorld").mockReturnValue(true);
  return character;
};

describe("@curtain-call/contents.NearestCharacterProvider", () => {
  it("provide nearest Character", () => {
    const world = new World();
    const userTrans = new Transformation().setLocal(Matrix.identity);
    const nearTargetable = new Character()
      .moveTo({ x: 2, y: 0 })
      .inTeam(Team.enemySide)
      .healthInitialized(1);
    const farTargetable = new Character()
      .moveTo({ x: 3, y: 0 })
      .inTeam(Team.enemySide)
      .healthInitialized(1);
    world.addActor(nearTargetable).addActor(farTargetable);

    const provider = new NearestCharacterProvider()
      .setTargetTeam(Team.enemySide)
      .attachTo(userTrans);

    const targetTrans = provider.getTargetTrans(world);

    expect(targetTrans).not.toBeUndefined();
    if (targetTrans)
      expect(targetTrans.getLocal()).toEqual(nearTargetable.trans.getLocal());
  });

  it("provide some target while alive target", () => {
    const world = new World();
    const userTrans = new Transformation().setLocal(Matrix.identity);
    const nearTargetable = new Character()
      .moveTo({ x: 2, y: 0 })
      .inTeam(Team.enemySide)
      .healthInitialized(1);
    const farTargetable = new Character()
      .moveTo({ x: 3, y: 0 })
      .inTeam(Team.enemySide)
      .healthInitialized(1);
    world.addActor(nearTargetable).addActor(farTargetable);

    const provider = new NearestCharacterProvider()
      .setTargetTeam(Team.enemySide)
      .attachTo(userTrans);

    const targetTrans1 = provider.getTargetTrans(world);
    farTargetable.moveTo({ x: 1, y: 0 });
    const targetTrans2 = provider.getTargetTrans(world);

    for (const targetTrans of [targetTrans1, targetTrans2]) {
      expect(targetTrans).not.toBeUndefined();
      if (targetTrans)
        expect(targetTrans.getLocal()).toEqual(nearTargetable.trans.getLocal());
    }
  });

  it.each`
    explanation              | nonTargetable
    ${"not in target team"}  | ${nonTargetableTeamCharacter()}
    ${"be dead"}             | ${daedCharacter()}
    ${"removing from world"} | ${removingCharacter()}
  `("do not provide target $explanation ", ({ nonTargetable }) => {
    const world = new World();
    const userTrans = new Transformation().setLocal(Matrix.identity);
    const nearNonTargetable = (nonTargetable as Character).moveTo({
      x: 2,
      y: 0,
    });
    const farTargetable = new Character()
      .moveTo({ x: 3, y: 0 })
      .inTeam(Team.enemySide)
      .healthInitialized(1);
    world.addActor(nearNonTargetable).addActor(farTargetable);

    const provider = new NearestCharacterProvider()
      .setTargetTeam(Team.enemySide)
      .attachTo(userTrans);

    const targetTrans = provider.getTargetTrans(world);

    expect(targetTrans).not.toBeUndefined();
    if (targetTrans)
      expect(targetTrans.getLocal()).toEqual(farTargetable.trans.getLocal());
  });
});
