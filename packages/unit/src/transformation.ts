import { Matrix } from "trans-vector2d";

export class Transformation {
  private local = Matrix.identity;
  private global = Matrix.identity;
  private parent?: Transformation;
  private readonly children = new Set<Transformation>();

  setLocal(matrix: Matrix): this {
    this.local = matrix;
    const parentGlobal = this.parent?.global || Matrix.identity;
    this.updateGlobal(parentGlobal);
    return this;
  }

  getLocal(): Matrix {
    return this.local;
  }

  getGlobal(): Matrix {
    return this.global;
  }

  attachTo(parent: Transformation): this {
    this.parent?.children.delete(this);
    this.parent = parent;
    parent.children.add(this);
    this.updateGlobal(parent.global);
    return this;
  }

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
