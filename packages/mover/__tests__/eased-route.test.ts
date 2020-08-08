import { Vector } from "trans-vector2d";
import { EasedRoute } from "../src";

describe("@curtain-call/mover.EasedRoute", () => {
  it("deal position by elapsed time", () => {
    const route = new EasedRoute().init({ x: 1, y: 2 }, 60, EasedRoute.linear);

    expect(route.getPosition({}, 0)).toStrictEqual({
      done: false,
      position: Vector.zero,
    });
    expect(route.getPosition({}, 30)).toStrictEqual({
      done: false,
      position: new Vector(0.5, 1),
    });
    expect(route.getPosition({}, 60)).toStrictEqual({
      done: true,
      position: new Vector(1, 2),
    });
  });

  it("deal position by easer", () => {
    const zeroEaser = jest.fn().mockReturnValue(0);
    const route = new EasedRoute().init({ x: 1, y: 2 }, 60, zeroEaser);

    expect(route.getPosition({}, 0)).toStrictEqual({
      done: false,
      position: Vector.zero,
    });
    expect(route.getPosition({}, 30)).toStrictEqual({
      done: false,
      position: Vector.zero,
    });
    expect(route.getPosition({}, 60)).toStrictEqual({
      done: true,
      position: Vector.zero,
    });
  });

  it("has easers", () => {
    expect(EasedRoute.linear).not.toBeUndefined();
    expect(EasedRoute.easeIn).not.toBeUndefined();
    expect(EasedRoute.easeOut).not.toBeUndefined();
    expect(EasedRoute.easeInOut).not.toBeUndefined();
  });
});
