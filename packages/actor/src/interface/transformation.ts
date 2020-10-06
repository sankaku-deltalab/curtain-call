import { Matrix } from "trans-vector2d";

/**
 * Transformation manage translation, rotation and scale.
 */
export interface Transformation {
  /**
   * Set local matrix and update global matrix.
   *
   * @param matrix New local matrix.
   * @returns this.
   */
  setLocal(matrix: Matrix): this;

  /**
   * Get local matrix.
   *
   * @returns Local matrix.
   */
  getLocal(): Matrix;

  /**
   * Get global matrix.
   *
   * @returns Global matrix.
   */
  getGlobal(): Matrix;

  /**
   * Get relative matrix.
   *
   * @param base Base transformation.
   * @returns Relative matrix.
   */
  calcRelativeFrom(base: Transformation): Matrix;

  /**
   * Attach other Transformation to self.
   *
   * @param child Attaching child Transformation.
   * @param keepWorldTransform When attached, keep world transform of child.
   * @returns this.
   */
  attachChild(child: Transformation, keepWorldTransform: boolean): this;

  /**
   * Detach child Actor from self.
   *
   * @param child Detaching child Transformation.
   * @param keepWorldTransform When detached, keep world transform of child.
   * @return this.
   */
  detachChild(child: Transformation, keepWorldTransform: boolean): this;

  /**
   * Notify attached to other.
   *
   * @param parent Parent transformation.
   */
  notifyAttachedTo(parent: Transformation): void;

  /**
   * Notify detached from other.
   */
  notifyDetachedFromParent(): void;

  /**
   * Notify parent is updated.
   */
  notifyParentUpdated(parentGlobal: Matrix): void;

  /**
   * Get attached parent.
   *
   * @returns Parent transformation.
   */
  getParent(): Transformation | undefined;
}
