import { World } from "@curtain-call/world";
import { Actor } from "@curtain-call/actor";
import { BasicDamageDealer } from "@curtain-call/health";
import { GuntreeWeapon, guntree as gt } from "@curtain-call/weapon";
import { Character, NullPlan, Plan } from "../../src";
import { Team } from "@curtain-call/util";

const planMock = <T extends World = World>(): Plan<T> => {
  const plan = new NullPlan();
  jest.spyOn(plan, "update");
  jest.spyOn(plan, "start");
  return plan;
};

describe("@curtain-call/contents.Character", () => {
  it("is in noSide team at first", () => {
    const character = new Character();

    expect(character.getTeam()).toBe(Team.noSide);
  });

  it("can join to team", () => {
    const character = new Character().setTeam(Team.playerSide);

    expect(character.getTeam()).toBe(Team.playerSide);
  });

  it("can set plan", () => {
    const plan = planMock();
    const character = new Character().plannedBy(plan);
    const world = new World();

    world.addActor(character);
    expect(plan.start).toBeCalledWith(world, character);

    const deltaSec = 0.125;
    character.update(world, deltaSec);
    expect(plan.update).toBeCalledWith(world, deltaSec, character);
  });

  it.each`
    immortality | takenDamage
    ${true}     | ${0}
    ${false}    | ${1}
  `("can be immortal", ({ immortality, takenDamage }) => {
    const character = new Character().initHealth(1, 1).asImmortal(immortality);

    const damageTakeCallback = jest.fn();
    character.event.on("takenDamage", damageTakeCallback);

    const world = new World();
    const dealer = new BasicDamageDealer();
    const damageType = jest.fn();
    character.takeDamage(world, 1, dealer, damageType);

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
      targetProvider: { getTargetPosition: jest.fn() },
    };
    const character = new Character({ weapon }).initWeapon(initArgs);

    expect(character.weapon.init).toBeCalledWith(initArgs);
  });
});
