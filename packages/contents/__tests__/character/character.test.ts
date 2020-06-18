import { World } from "@curtain-call/world";
import { Actor } from "@curtain-call/actor";
import { DamageDealer } from "@curtain-call/health";
import { GuntreeWeapon, guntree as gt } from "@curtain-call/weapon";
import { Character, Team, NullPlan, Plan } from "../../src";

const planMock = <T extends World = World>(): Plan<T> => {
  const plan = new NullPlan();
  jest.spyOn(plan, "update");
  return plan;
};

describe("@curtain-call/contents.Character", () => {
  it("is in noSide team at first", () => {
    const character = new Character();

    expect(character.team()).toBe(Team.noSide);
  });

  it("can join to team", () => {
    const character = new Character().inTeam(Team.playerSide);

    expect(character.team()).toBe(Team.playerSide);
  });

  it("can set plan", () => {
    const plan = planMock();
    const character = new Character().plannedBy(plan);

    const world = new World();
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

    const world = new World();
    const dealer = new DamageDealer<World>();
    const damageType = jest.fn();
    character.health.takeDamage(world, 1, dealer, damageType);

    expect(damageTakeCallback).toBeCalledWith(
      world,
      takenDamage,
      dealer,
      damageType
    );
  });

  it("has Weapon", () => {
    const character = new Character();
    expect(character.weapon).toBeInstanceOf(GuntreeWeapon);
  });

  it("can init Weapon", () => {
    const weapon = new GuntreeWeapon<World, Actor<World>>();
    jest.spyOn(weapon, "init");
    const initArgs = {
      guntree: gt.nop(),
      muzzles: new Map(),
      bulletGenerator: { generate: jest.fn() },
      targetProvider: { get: jest.fn() },
    };
    const character = new Character({ weapon }).initWeapon(initArgs);

    expect(character.weapon.init).toBeCalledWith(initArgs);
  });
});
