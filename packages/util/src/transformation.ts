import { Matrix } from "trans-vector2d";
import { Transformation as ITransformation } from "@curtain-call/actor";

/**
 * Transformation manage translation, rotation and scale.
 */
export class Transformation implements ITransformation {
  private local = Matrix.identity;
  private global = Matrix.identity;
  private parent?: Transformation;
  private readonly children = new Set<Transformation>();

  /**
   * Set local matrix and update global matrix.
   *
   * @param matrix New local matrix.
   * @returns this.
   */
  setLocal(matrix: Matrix): this {
    this.local = matrix;
    const parentGlobal = this.parent?.global || Matrix.identity;
    this.updateGlobal(parentGlobal);
    return this;
  }

  /**
   * Get local matrix.
   *
   * @returns Local matrix.
   */
  getLocal(): Matrix {
    return this.local;
  }

  /**
   * Get global matrix.
   *
   * @returns Global matrix.
   */
  getGlobal(): Matrix {
    return this.global;
  }

  /**
   * Get relative matrix.
   *
   * @param base Base transformation.
   * @returns Relative matrix.
   */
  calcRelative(base: Transformation): Matrix {
    return base.getGlobal().localize(this.global);
  }

  /**
   * Attach other Transformation to self.
   *
   * @param child Attaching child Transformation.
   * @param keepWorldTransform When attached, keep world transform of child.
   * @returns this.
   */
  attachChild(child: Transformation, keepWorldTransform: boolean): this {
    if (child.parent) child.parent.detachChild(child, keepWorldTransform);

    child.parent = this;
    this.children.add(this);
    if (keepWorldTransform) {
      const newChildLocal = child.getGlobal().localizedBy(this.getGlobal());
      child.setLocal(newChildLocal);
    }
    child.updateGlobal(this.global);
    return this;
  }

  /**
   * Detach child Actor from self.
   *
   * @param child Detaching child Transformation.
   * @param keepWorldTransform When detached, keep world transform of child.
   * @return this.
   */
  detachChild(child: Transformation, keepWorldTransform: boolean): this {
    if (keepWorldTransform) {
      const newChildLocal = child.getGlobal();
      child.setLocal(newChildLocal);
    }
    child.parent = undefined;
    this.updateGlobal(Matrix.identity);
    return this;
  }

  /**
   * Attach self to other Transformation and update global matrix.
   *
   * @deprecated Use `attachChild`.
   * @param parent Other Transformation.
   * @returns this.
   */
  attachTo(parent: Transformation): this {
    this.parent?.children.delete(this);
    this.parent = parent;
    parent.children.add(this);
    this.updateGlobal(parent.global);
    return this;
  }

  /**
   * Detach self from parent.
   *
   * @deprecated Use `detachChild`.
   * @return this.
   */
  detachFromParent(): this {
    if (!this.parent) return this;

    this.parent.children.delete(this);
    this.parent = undefined;
    this.updateGlobal(Matrix.identity);
    return this;
  }

  private updateGlobal(parentGlobalMatrix: Matrix): void {
    this.global = parentGlobalMatrix.globalize(this.local);
    this.children.forEach((child) => child.updateGlobal(this.global));
  }
}
