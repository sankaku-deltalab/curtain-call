import * as PIXI from "pixi.js";
import { Matrix } from "trans-vector2d";

/**
 * Convert Matrix of pixi.js to Matrix of trans-vector2d.
 *
 * @param mat Pixi Matrix.
 * @returns trans-vector2d Matrix.
 */
export const pixiMatrixToMatrix2d = (mat: PIXI.Matrix): Matrix => {
  return Matrix.from(Object.assign({ e: mat.tx, f: mat.ty }, mat));
};

/**
 * Convert Matrix of trans-vector2d to Matrix of pixi.js.
 *
 * @param mat trans-vector2d Matrix.
 * @returns Pixi Matrix.
 */
export const matrix2dToPixiMatrix = (mat: Matrix): PIXI.Matrix => {
  return new PIXI.Matrix(mat.a, mat.b, mat.c, mat.d, mat.e, mat.f);
};
