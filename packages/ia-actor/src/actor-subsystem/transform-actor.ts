import { Vector, Matrix, MatrixLike } from "trans-vector2d";

export class TransformActor {
  // TODO: Implement attaching
  private trans = Matrix.identity;

  /**
   * Get global position of this.
   *
   * @returns Global position.
   */
  position(): Vector {
    return this.trans.decompose().translation;
  }

  /**
   * Get global rotation of this.
   *
   * @returns Global rotation.
   */
  rotation(): number {
    return this.trans.decompose().rotation;
  }

  /**
   * Get global scaling of this.
   *
   * @returns Global scaling.
   */
  scale(): Vector {
    return this.trans.decompose().scale;
  }

  /**
   * Get global transformation matrix of this.
   *
   * @returns Global transformation matrix.
   */
  transformation(): Matrix {
    return this.trans;
  }

  /**
   * Set local transformation.
   *
   * @param newTrans New transformation.
   */
  setLocalTransformation(newTrans: MatrixLike): void {
    this.trans = Matrix.from(newTrans);
  }
}
