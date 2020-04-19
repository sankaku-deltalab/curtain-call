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

  describe("can attach to parent Transformation", () => {
    it("from function", () => {
      const parent = new Transformation();
      const child = new Transformation();
      expect(() => child.attachTo(parent)).not.toThrowError();
    });

    it("and can detach", () => {
      const parent = new Transformation();
      const child = new Transformation();
      child.attachTo(parent);

      expect(() => child.detachFromParent()).not.toThrowError();
    });

    it("and update global Matrix of self when attached", () => {
      const parent = new Transformation().setLocal(
        Matrix.identity.translate({ x: 1, y: 2 })
      );
      const child = new Transformation().setLocal(
        Matrix.identity.translate({ x: 3, y: 4 })
      );

      child.attachTo(parent);

      const expectedGlobal = Matrix.identity.translate({ x: 4, y: 6 });
      expect(child.getGlobal()).toEqual(expectedGlobal);
    });

    it("and update global Matrix of self when parent local was changed", () => {
      const parent = new Transformation();
      const child = new Transformation().setLocal(
        Matrix.identity.translate({ x: 3, y: 4 })
      );

      parent.setLocal(Matrix.identity.translate({ x: 1, y: 2 }));
      child.attachTo(parent);

      const expectedGlobal = Matrix.identity.translate({ x: 4, y: 6 });
      expect(child.getGlobal()).toEqual(expectedGlobal);
    });

    it("and update global Matrix of self when parent attached to other", () => {
      const parent = new Transformation();
      const child = new Transformation().setLocal(
        Matrix.identity.translate({ x: 3, y: 4 })
      );

      child.attachTo(parent);
      const parentOfParent = new Transformation().setLocal(
        Matrix.identity.translate({ x: 1, y: 2 })
      );
      parent.attachTo(parentOfParent);

      const expectedGlobal = Matrix.identity.translate({ x: 4, y: 6 });
      expect(child.getGlobal()).toEqual(expectedGlobal);
    });
  });
});
