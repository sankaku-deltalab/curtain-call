import * as PIXI from "pixi.js";
import { Matrix } from "trans-vector2d";
import { pixiMatrixToMatrix2d, matrix2dToPixiMatrix } from "../src";

describe("@curtain-call/util.matrix-convert", () => {
  it("can convert pixi matrix to matrix 2d", () => {
    const pixiMat = new PIXI.Matrix(1, 2, 3, 4, 5, 6);
    const mat2d = new Matrix(1, 2, 3, 4, 5, 6);
    expect(pixiMatrixToMatrix2d(pixiMat)).toEqual(mat2d);
  });

  it("can convert matrix 2d to pixi matrix", () => {
    const pixiMat = new PIXI.Matrix(1, 2, 3, 4, 5, 6);
    const mat2d = new Matrix(1, 2, 3, 4, 5, 6);
    expect(matrix2dToPixiMatrix(mat2d)).toEqual(pixiMat);
  });
});
