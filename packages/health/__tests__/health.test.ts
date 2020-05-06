import { Health, DamageDealer } from "../src";

describe("@curtain-call/health.Health", () => {
  it("can init health and health max", () => {
    const amount = 123;
    const health = new Health().init(amount);

    expect(health.current()).toBe(amount);
    expect(health.max()).toBe(amount);
  });

  it.each`
    initialHealth | damage | RemainHealth
    ${10}         | ${1}   | ${9}
    ${10}         | ${10}  | ${0}
    ${10}         | ${11}  | ${0}
  `("can take damage", ({ initialHealth, damage, RemainHealth }) => {
    const health = new Health().init(initialHealth);
    jest.spyOn(health.event, "emit");

    const scene = {};
    const dealer = new DamageDealer();
    const type = { name: "testDamage" };
    health.takeDamage(scene, damage, dealer, type);

    expect(health.current()).toBe(RemainHealth);
    expect(health.max()).toBe(initialHealth);
    const takenDamage = initialHealth - RemainHealth;
    expect(health.event.emit).toBeCalledWith(
      "takenDamage",
      scene,
      takenDamage,
      dealer,
      type
    );
  });

  describe("can die", () => {
    it.each`
      initialHealth | damage | died
      ${10}         | ${10}  | ${true}
      ${0}          | ${10}  | ${false}
    `(
      "when health amount was become zero and healthMax > 0",
      ({ initialHealth, damage, died }) => {
        const health = new Health().init(initialHealth);

        const scene = {};
        const dealer = new DamageDealer();
        const type = { name: "testDamage" };
        health.takeDamage(scene, damage, dealer, type);

        expect(health.isDead()).toBe(died);
      }
    );

    it("and emit died event when died", () => {
      const health = new Health().init(1);
      jest.spyOn(health.event, "emit");

      const scene = {};
      const dealer = new DamageDealer();
      const type = { name: "testDamage" };
      health.takeDamage(scene, 1, dealer, type);

      expect(health.event.emit).toBeCalledWith("died", scene, dealer, type);
    });

    it("and damage and died event was not emitted while dead", () => {
      const health = new Health().init(1);

      const scene = {};
      const dealer = new DamageDealer();
      const type = { name: "testDamage" };
      health.takeDamage(scene, 1, dealer, type);

      jest.spyOn(health.event, "emit");
      health.takeDamage(scene, 1, dealer, type);

      expect(health.event.emit).not.toBeCalled();
    });
  });

  it("can die directory", () => {
    const health = new Health().init(1);

    const scene = {};
    const dealer = new DamageDealer();
    const type = { name: "testDamage" };
    health.die(scene, dealer, type);

    expect(health.isDead()).toBe(true);
  });

  it.each`
    initialHealth | damage | healing | RemainHealth
    ${10}         | ${1}   | ${1}    | ${10}
    ${10}         | ${10}  | ${1}    | ${1}
    ${10}         | ${9}   | ${10}   | ${10}
  `("can heal damage", ({ initialHealth, damage, healing, RemainHealth }) => {
    const health = new Health().init(initialHealth);

    const scene = {};
    const dealer = new DamageDealer();
    const type = { name: "testDamage" };
    health.takeDamage(scene, damage, dealer, type);
    health.heal(scene, healing);

    expect(health.current()).toBe(RemainHealth);
    expect(health.max()).toBe(initialHealth);
  });

  describe("can use interceptor", () => {
    const interceptorClass = jest.fn((modifiedDamage) => ({
      interceptDamage: jest.fn().mockReturnValue(modifiedDamage),
    }));

    it("when take damage, damage will modified", () => {
      const initialHealth = 20;
      const modifiedDamage = 5;
      const originalDamage = 10;
      const interceptor = new interceptorClass(modifiedDamage);
      const health = new Health()
        .init(initialHealth)
        .addInterceptor(interceptor);
      jest.spyOn(health.event, "emit");

      const scene = {};
      const dealer = new DamageDealer();
      const type = { name: "testDamage" };
      health.takeDamage(scene, originalDamage, dealer, type);

      expect(interceptor.interceptDamage).toBeCalledWith(
        scene,
        originalDamage,
        dealer,
        type,
        health
      );
      expect(health.event.emit).toBeCalledWith(
        "takenDamage",
        scene,
        modifiedDamage,
        dealer,
        type
      );
      expect(health.current()).toBe(initialHealth - modifiedDamage);
    });

    it("and can remove interceptor", () => {
      const initialHealth = 20;
      const modifiedDamage = 5;
      const originalDamage = 10;
      const interceptor = new interceptorClass(modifiedDamage);
      const health = new Health()
        .init(initialHealth)
        .addInterceptor(interceptor)
        .removeInterceptor(interceptor);
      jest.spyOn(health.event, "emit");

      const scene = {};
      const dealer = new DamageDealer();
      const type = { name: "testDamage" };
      health.takeDamage(scene, originalDamage, dealer, type);

      expect(interceptor.interceptDamage).not.toBeCalled();
      expect(health.current()).toBe(initialHealth - originalDamage);
    });
  });
});
