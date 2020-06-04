import { Character, Team, NullPlan, Plan } from "../../src";
import { DamageDealer } from "@curtain-call/health";
import { Weapon, NullWeapon } from "@curtain-call/weapon";

const planMock = <T>(): Plan<T> => {
  const plan = new NullPlan();
  jest.spyOn(plan, "update");
  return plan;
};

const weaponMock = <T>(): Weapon<T> => {
  const weapon = new NullWeapon();
  jest.spyOn(weapon, "update");
  return weapon;
};

describe("@curtain-call/contents.Character", () => {
  it("is in noSide team at first", () => {
    const character = new Character();

    expect(character.getTeam()).toBe(Team.noSide);
  });

  it("can join to team", () => {
    const character = new Character().inTeam(Team.playerSide);

    expect(character.getTeam()).toBe(Team.playerSide);
  });

  it("can set plan", () => {
    const plan = planMock();
    const character = new Character().plannedBy(plan);

    const world = "world";
    const deltaSec = 0.125;
    character.update(world, deltaSec);

    expect(plan.update).toBeCalledWith(world, deltaSec, character);
  });

  it.each`
    immortality | takenDamage
    ${true}     | ${0}
    ${false}    | ${1}
  `("can be immortal", ({ immortality, takenDamage }) => {
    const character = new Character()
      .healthInitialized(1)
      .asImmortal(immortality);

    const damageTakeCallback = jest.fn();
    character.health.event.on("takenDamage", damageTakeCallback);

    const world = "world";
    const dealer = new DamageDealer();
    const damageType = jest.fn();
    character.health.takeDamage(world, 1, dealer, damageType);

    expect(damageTakeCallback).toBeCalledWith(
      world,
      takenDamage,
      dealer,
      damageType
    );
  });

  it("can arm weapon", () => {
    const weapon = weaponMock();
    const character = new Character().armedWith(weapon);

    const world = "world";
    const deltaSec = 0.125;
    character.update(world, deltaSec);

    expect(character.getWeapon()).toBe(weapon);
    expect(weapon.update).toBeCalledWith(world, deltaSec);
  });
});
