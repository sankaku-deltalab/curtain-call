import { Matrix, Vector } from "trans-vector2d";
import { worldMockClass } from "@curtain-call/actor-test-mocks";
import { MoveRoute, RouteMover } from "../src";

const routeMock = (done: boolean, x: number, y: number): MoveRoute => {
  const cls = jest.fn(() => ({
    getPosition: jest
      .fn()
      .mockReturnValue({ done, position: new Vector(x, y) }),
  }));
  return new cls();
};

const currentTrans = Matrix.from({
  translation: new Vector(3, 4),
  rotation: 1,
});

describe("@curtain-call/mover.RouteMover", () => {
  it("deal global translation from route", () => {
    const route = routeMock(false, 1, 2);
    const mover = new RouteMover();

    mover.start(route);

    const world = new worldMockClass();
    const deltaSec = 123;
    const expectedTrans = Matrix.from({
      translation: new Vector(4, 6),
      rotation: 1,
    });
    expect(mover.update(world, deltaSec, currentTrans)).toStrictEqual({
      done: false,
      newTrans: expectedTrans,
    });
  });

  it("can abort route", () => {
    const route = routeMock(false, 1, 2);
    const mover = new RouteMover();

    mover.start(route);
    mover.abort();

    const world = new worldMockClass();
    const deltaSec = 123;
    expect(mover.update(world, deltaSec, currentTrans)).toStrictEqual({
      done: true,
      newTrans: currentTrans,
    });
  });
});
