import { Matrix, Vector } from "trans-vector2d";
import { Mover } from "@curtain-call/mover";
import { Sprite } from "@curtain-call/display-object";

export const moverMock = <T>(done: boolean, delta: Vector): Mover<T> => {
  const cls = jest.fn(() => ({
    update: jest
      .fn()
      .mockImplementation(
        (world: T, deltaSec: number, currentTrans: Matrix) => ({
          done,
          newTrans: currentTrans.translated(delta.mlt(deltaSec)),
        })
      ),
  }));
  return new cls();
};

export const spriteMock = <T>(): Sprite<T> => {
  const obj = new Sprite();
  jest.spyOn(obj, "updatePixiObject");
  return obj;
};
