import { Health, BasicDamageDealer } from "../src";

describe("@curtain-call/health.BasicDamageDealer", () => {
  it("chain event to parent", () => {
    const weaponDealer = new BasicDamageDealer();
    jest.spyOn(weaponDealer, "notifyDealtDamage");
    jest.spyOn(weaponDealer, "notifyKilled");

    const bulletDealer = new BasicDamageDealer().setDamageDealerParent(
      weaponDealer
    );

    const world = "world";
    const taker = new Health();
    const damage = 123;
    const type = { name: "testDamage" };

    bulletDealer.notifyDealtDamage(world, damage, taker, type);
    expect(weaponDealer.notifyDealtDamage).toBeCalledWith(
      world,
      damage,
      taker,
      type
    );

    bulletDealer.notifyKilled(world, taker, type);
    expect(weaponDealer.notifyKilled).toBeCalledWith(world, taker, type);
  });
});
