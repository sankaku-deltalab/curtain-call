import { Health } from "../src";

describe("@curtain-call/health.Health", () => {
  it.each`
    initialHealth | initialHealthMax | expectedHealth | expectedHealthMax
    ${10}         | ${10}            | ${10}          | ${10}
    ${9}          | ${10}            | ${9}           | ${10}
  `(
    "can init health and health max",
    ({
      initialHealth,
      initialHealthMax,
      expectedHealth,
      expectedHealthMax,
    }) => {
      const health = new Health().init(initialHealth, initialHealthMax);

      expect(health.current()).toBe(expectedHealth);
      expect(health.max()).toBe(expectedHealthMax);
    }
  );
  it.each`
    reason            | initialHealth | initialHealthMax
    ${"health > max"} | ${10}         | ${9}
    ${"health < 0"}   | ${-1}         | ${10}
    ${"max < 0"}      | ${10}         | ${-1}
  `("can not init health if $reason", ({ initialHealth, initialHealthMax }) => {
    const health = new Health();
    expect(() => health.init(initialHealth, initialHealthMax)).toThrowError();
  });

  it.each`
    initialHealth | damage | RemainHealth
    ${10}         | ${1}   | ${9}
    ${10}         | ${10}  | ${0}
    ${10}         | ${11}  | ${0}
    ${0}          | ${1}   | ${0}
  `("can take damage", ({ initialHealth, damage, RemainHealth }) => {
    const health = new Health().init(initialHealth, initialHealth);
    const r = health.takeDamage(damage);

    expect(health.current()).toBe(RemainHealth);
    expect(health.max()).toBe(initialHealth);
    expect(r.actualDamage).toBe(initialHealth - RemainHealth);
  });

  describe("can die", () => {
    it.each`
      initialHealth | damage | died
      ${10}         | ${10}  | ${true}
      ${0}          | ${10}  | ${false}
    `(
      "when health amount was become zero",
      ({ initialHealth, damage, died }) => {
        const health = new Health().init(initialHealth, initialHealth);

        const r = health.takeDamage(damage);

        expect(health.isDead()).toBe(health.current() == 0);
        expect(r.died).toBe(died);
      }
    );
  });

  it("can die directly", () => {
    const health = new Health().init(1, 1);

    health.kill();

    expect(health.isDead()).toBe(true);
  });

  it.each`
    initialHealth | initialHealthMax | healing | RemainHealth | healed
    ${5}          | ${10}            | ${1}    | ${6}         | ${1}
    ${10}         | ${10}            | ${1}    | ${10}        | ${0}
    ${0}          | ${10}            | ${1}    | ${1}         | ${1}
  `(
    "can heal damage",
    ({ initialHealth, initialHealthMax, healing, RemainHealth }) => {
      const health = new Health().init(initialHealth, initialHealthMax);

      health.heal(healing);

      expect(health.current()).toBe(RemainHealth);
      expect(health.max()).toBe(initialHealthMax);
    }
  );
});
