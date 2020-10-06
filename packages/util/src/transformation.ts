import { Matrix } from "trans-vector2d";
import { Transformation as ITransformation } from "@curtain-call/actor";

/**
 * Transformation manage translation, rotation and scale.
 */
export class Transformation implements ITransformation {
  private local = Matrix.identity;
  private global = Matrix.identity;
  private parent?: ITransformation;
  private readonly children = new Set<ITransformation>();

  /**
   * Set local matrix and update global matrix.
   *
   * @param matrix New local matrix.
   * @returns this.
   */
  setLocal(matrix: Matrix): this {
    this.local = matrix;
    const parentGlobal = this.parent?.getGlobal() || Matrix.identity;
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
  calcRelativeFrom(base: ITransformation): Matrix {
    return base.getGlobal().localize(this.global);
  }

  /**
   * Attach other Transformation to self.
   *
   * @param child Attaching child Transformation.
   * @param keepWorldTransform When attached, keep world transform of child.
   * @returns this.
   */
  attachChild(child: ITransformation, keepWorldTransform: boolean): this {
    const oldParent = child.getParent();
    const oldGlobal = child.getGlobal();
    if (oldParent) oldParent.detachChild(child, keepWorldTransform);

    this.children.add(child);
    if (keepWorldTransform) {
      const newChildLocal = oldGlobal.localizedBy(this.getGlobal());
      child.setLocal(newChildLocal);
    }
    child.notifyAttachedTo(this);
    return this;
  }

  /**
   * Detach child Actor from self.
   *
   * @param child Detaching child Transformation.
   * @param keepWorldTransform When detached, keep world transform of child.
   * @return this.
   */
  detachChild(child: ITransformation, keepWorldTransform: boolean): this {
    if (keepWorldTransform) {
      const newChildLocal = child.getGlobal();
      child.setLocal(newChildLocal);
    }
    this.children.delete(child);
    child.notifyDetachedFromParent();
    return this;
  }

  /**
   * Notify attached from other.
   *
   * @param parent Parent transformation.
   */
  notifyAttachedTo(parent: ITransformation): void {
    this.parent = parent;
    this.updateGlobal(parent.getGlobal());
  }

  /**
   * Notify detached from other.
   */
  notifyDetachedFromParent(): void {
    this.parent = undefined;
    this.updateGlobal(Matrix.identity);
  }

  /**
   * Get attached parent.
   *
   * @returns Parent transformation.
   */
  getParent(): ITransformation | undefined {
    return this.parent;
  }

  /**
   * Notify parent is updated.
   *
   * @returns this.
   */
  notifyParentUpdated(parentGlobal: Matrix): void {
    this.updateGlobal(parentGlobal);
  }

  private updateGlobal(parentGlobalMatrix: Matrix): void {
    this.global = parentGlobalMatrix.globalize(this.local);
    const gloMat = this.getGlobal();
    this.children.forEach((child) => child.notifyParentUpdated(gloMat));
  }
}
