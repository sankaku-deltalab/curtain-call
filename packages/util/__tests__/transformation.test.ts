import { Transformation } from "../src";
import { Matrix } from "trans-vector2d";

describe("@curtain-call/util.Transformation", () => {
  it("has local matrix", () => {
    const trans = new Transformation();
    expect(trans.getLocal()).toBeInstanceOf(Matrix);
  });

  it("has global matrix", () => {
    const trans = new Transformation();
    expect(trans.getGlobal()).toBeInstanceOf(Matrix);
  });

  it("can calc relative matrix from other Transformation", () => {
    const base = new Transformation().setLocal(
      Matrix.from({ translation: { x: 1, y: 2 }, rotation: Math.PI / 2 })
    );
    const trans = new Transformation().setLocal(
      Matrix.from({ translation: { x: 3, y: 5 }, rotation: Math.PI * (3 / 4) })
    );

    const rel = trans.calcRelativeFrom(base).decompose();

    expect(rel.translation.x).toBeCloseTo(3);
    expect(rel.translation.y).toBeCloseTo(-2);
    expect(rel.rotation).toBeCloseTo(Math.PI / 4);
  });

  describe("can attach other Transformation", () => {
    it("from function", () => {
      const parent = new Transformation();
      const child = new Transformation();
      expect(() => parent.attachChild(child, false)).not.toThrowError();
    });

    it("and can detach", () => {
      const parent = new Transformation();
      const child = new Transformation();
      parent.attachChild(child, false);

      expect(() => parent.detachChild(child, false)).not.toThrowError();
    });

    it("and update global Matrix of self when attached", () => {
      const parent = new Transformation().setLocal(
        Matrix.translation({ x: 1, y: 2 })
      );
      const child = new Transformation().setLocal(
        Matrix.translation({ x: 3, y: 4 })
      );

      parent.attachChild(child, false);

      const expectedGlobal = Matrix.translation({ x: 4, y: 6 });
      expect(child.getGlobal()).toEqual(expectedGlobal);
    });

    it("and update global Matrix of self when parent local was changed", () => {
      const parent = new Transformation();
      const child = new Transformation().setLocal(
        Matrix.translation({ x: 3, y: 4 })
      );

      parent.setLocal(Matrix.translation({ x: 1, y: 2 }));
      parent.attachChild(child, false);

      const expectedGlobal = Matrix.translation({ x: 4, y: 6 });
      expect(child.getGlobal()).toEqual(expectedGlobal);
    });

    it("and update global Matrix of self when parent attached to other", () => {
      const parent = new Transformation();
      const child = new Transformation().setLocal(
        Matrix.translation({ x: 3, y: 4 })
      );

      parent.attachChild(child, false);
      const parentOfParent = new Transformation().setLocal(
        Matrix.translation({ x: 1, y: 2 })
      );
      parentOfParent.attachChild(parent, false);

      const expectedGlobal = Matrix.translation({ x: 4, y: 6 });
      expect(child.getGlobal()).toEqual(expectedGlobal);
    });

    it("and can keep world transformation when attach", () => {
      const parent = new Transformation().setLocal(
        Matrix.translation({ x: 1, y: 2 })
      );
      const child = new Transformation().setLocal(
        Matrix.translation({ x: 3, y: 4 })
      );

      parent.attachChild(child, true);

      const expectedGlobal = Matrix.translation({ x: 3, y: 4 });
      expect(child.getGlobal()).toEqual(expectedGlobal);
    });

    it("and can keep world transformation when detach", () => {
      const parent = new Transformation().setLocal(
        Matrix.translation({ x: 1, y: 2 })
      );
      const child = new Transformation().setLocal(
        Matrix.translation({ x: 3, y: 4 })
      );

      parent.attachChild(child, false).detachChild(child, true);

      const expectedGlobal = Matrix.translation({ x: 4, y: 6 });
      expect(child.getGlobal()).toEqual(expectedGlobal);
    });

    it("and throw error if attach as circle", () => {
      const child = new Transformation();
      const parent = new Transformation().attachChild(child, false);
      const parentOfParent = new Transformation().attachChild(parent, false);

      expect(() => child.attachChild(parentOfParent, false)).toThrowError();
    });
  });
});
