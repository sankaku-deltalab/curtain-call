import { Matrix } from "trans-vector2d";
import { MoveRoute, RouteMover } from "../src";

const routeMock = <T, A>(): MoveRoute<T, A> => {
  const cls = jest.fn(() => ({
    getTransformationAt: jest
      .fn()
      .mockReturnValue({ done: true, mat: Matrix.identity }),
  }));
  return new cls();
};

describe("@curtain-call/mover.RouteMover", () => {
  describe("deal movement delta from route", () => {
    it("initial position was identity", () => {
      const routeMovement = {
        done: false,
        mat: Matrix.translation({ x: 1, y: 2 }),
      };
      const route = routeMock();
      route.getTransformationAt = jest.fn().mockReturnValue(routeMovement);
      const mover = new RouteMover();

      const scene = jest.fn();
      const deltaSec = 123;
      const actor = jest.fn();
      mover.start(route);

      expect(mover.update(scene, deltaSec, actor)).toStrictEqual({
        done: false,
        deltaMat: Matrix.translation({ x: 1, y: 2 }),
      });
    });

    it("deal just delta", () => {
      const routeMovement1 = {
        done: false,
        mat: Matrix.translation({ x: 1, y: 2 }),
      };
      const routeMovement2 = {
        done: true,
        mat: Matrix.translation({ x: 3, y: 4 }),
      };
      const route = routeMock();
      route.getTransformationAt = jest
        .fn()
        .mockReturnValueOnce(routeMovement1)
        .mockReturnValueOnce(routeMovement2);
      const mover = new RouteMover();

      const scene = jest.fn();
      const deltaSec = 123;
      const actor = jest.fn();
      mover.start(route);
      mover.update(scene, deltaSec, actor);

      expect(mover.update(scene, deltaSec, actor)).toStrictEqual({
        done: true,
        deltaMat: Matrix.translation({ x: 2, y: 2 }),
      });
    });

    it("deal non delta if route was already finished", () => {
      const routeMovement = {
        done: true,
        mat: Matrix.translation({ x: 1, y: 2 }),
      };
      const route = routeMock();
      route.getTransformationAt = jest.fn().mockReturnValue(routeMovement);
      const mover = new RouteMover();

      const scene = jest.fn();
      const deltaSec = 123;
      const actor = jest.fn();
      mover.start(route);
      mover.update(scene, deltaSec, actor);

      expect(mover.update(scene, deltaSec, actor)).toStrictEqual({
        done: true,
        deltaMat: Matrix.identity,
      });
    });

    it("and can abort", () => {
      const routeMovement1 = {
        done: false,
        mat: Matrix.translation({ x: 1, y: 2 }),
      };
      const routeMovement2 = {
        done: true,
        mat: Matrix.translation({ x: 3, y: 4 }),
      };
      const route = routeMock();
      route.getTransformationAt = jest
        .fn()
        .mockReturnValueOnce(routeMovement1)
        .mockReturnValueOnce(routeMovement2);
      const mover = new RouteMover();

      const scene = jest.fn();
      const deltaSec = 123;
      const actor = jest.fn();
      mover.start(route);
      mover.update(scene, deltaSec, actor);
      mover.abort();

      expect(mover.update(scene, deltaSec, actor)).toStrictEqual({
        done: true,
        deltaMat: Matrix.identity,
      });
    });
  });
});
