import { Health, DamageDealer } from "../src";

describe("@curtain-call/health.DamageDealer", () => {
  it("emit event when dealt damage", () => {
    const dealer = new DamageDealer();
    const ev = jest.fn();
    dealer.event.on("dealtDamage", ev);

    const world = "world";
    const damage = 123;
    const taker = new Health();
    const type = { name: "testDamage" };
    dealer.notifyDealtDamage(world, damage, taker, type);

    expect(ev).toBeCalledWith(world, damage, [dealer], taker, type);
  });

  it("emit event when killed opponent", () => {
    const dealer = new DamageDealer();
    const ev = jest.fn();
    dealer.event.on("killed", ev);

    const world = "world";
    const taker = new Health();
    const type = { name: "testDamage" };
    dealer.notifyKilled(world, taker, type);

    expect(ev).toBeCalledWith(world, [dealer], taker, type);
  });

  it("can chain event", () => {
    const weaponDealer = new DamageDealer();
    const damageEv = jest.fn();
    weaponDealer.event.on("dealtDamage", damageEv);
    const killEv = jest.fn();
    weaponDealer.event.on("killed", killEv);
    const bulletDealer = new DamageDealer().chainedFrom(weaponDealer);

    const world = "world";
    const taker = new Health();
    const damage = 123;
    const type = { name: "testDamage" };

    bulletDealer.notifyDealtDamage(world, damage, taker, type);
    expect(damageEv).toBeCalledWith(
      world,
      damage,
      [bulletDealer, weaponDealer],
      taker,
      type
    );

    bulletDealer.notifyKilled(world, taker, type);
    expect(killEv).toBeCalledWith(
      world,
      [bulletDealer, weaponDealer],
      taker,
      type
    );
  });
});
