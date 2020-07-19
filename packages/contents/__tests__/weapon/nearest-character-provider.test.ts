import { Matrix } from "trans-vector2d";
import { World } from "@curtain-call/world";
import { Transformation } from "@curtain-call/util";
import { NearestCharacterProvider, Character, Team } from "../../src";

const nonTargetableTeamCharacter = (): Character => {
  return new Character()
    .moveTo({ x: 0, y: 0 })
    .inTeam(Team.noSide)
    .initHealth(1, 1);
};

const daedCharacter = (): Character => {
  const character = new Character()
    .moveTo({ x: 0, y: 0 })
    .inTeam(Team.enemySide)
    .initHealth(1, 1);
  jest.spyOn(character, "isDead").mockReturnValue(true);
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
      .initHealth(1, 1);
    const farTargetable = new Character()
      .moveTo({ x: 3, y: 0 })
      .inTeam(Team.enemySide)
      .initHealth(1, 1);
    world.addActor(nearTargetable).addActor(farTargetable);

    const provider = new NearestCharacterProvider()
      .setTargetTeam(Team.enemySide)
      .attachTo(userTrans);

    const targetPos = provider.getTargetPosition(world);

    expect(targetPos).not.toBeUndefined();
    if (targetPos) {
      const {
        translation: nearTargetablePos,
      } = nearTargetable.getWorldTransform().decompose();
      expect(targetPos).toEqual(nearTargetablePos);
    }
  });

  it("provide some target while alive target", () => {
    const world = new World();
    const userTrans = new Transformation().setLocal(Matrix.identity);
    const nearTargetable = new Character()
      .moveTo({ x: 2, y: 0 })
      .inTeam(Team.enemySide)
      .initHealth(1, 1);
    const farTargetable = new Character()
      .moveTo({ x: 3, y: 0 })
      .inTeam(Team.enemySide)
      .initHealth(1, 1);
    world.addActor(nearTargetable).addActor(farTargetable);

    const provider = new NearestCharacterProvider()
      .setTargetTeam(Team.enemySide)
      .attachTo(userTrans);

    const targetPos1 = provider.getTargetPosition(world);
    farTargetable.moveTo({ x: 1, y: 0 });
    const targetPos2 = provider.getTargetPosition(world);

    for (const targetPos of [targetPos1, targetPos2]) {
      expect(targetPos).not.toBeUndefined();
      if (targetPos) {
        const {
          translation: nearTargetablePos,
        } = nearTargetable.getWorldTransform().decompose();
        expect(targetPos).toEqual(nearTargetablePos);
      }
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
      .initHealth(1, 1);
    world.addActor(nearNonTargetable).addActor(farTargetable);

    const provider = new NearestCharacterProvider()
      .setTargetTeam(Team.enemySide)
      .attachTo(userTrans);

    const targetPos = provider.getTargetPosition(world);

    expect(targetPos).not.toBeUndefined();
    if (targetPos) {
      const {
        translation: nearTargetablePos,
      } = farTargetable.getWorldTransform().decompose();
      expect(targetPos).toEqual(nearTargetablePos);
    }
  });
});
