import { Collision, CollisionShape, Box2d } from "../src";
import { Transformation } from "@curtain-call/util";

const shapeMock = (boxes: Box2d[] = []): CollisionShape => {
  const shapeClass = jest.fn(() => ({
    trans: new Transformation(),
    getBox2Ds: jest.fn().mockReturnValue(boxes),
  }));
  return new shapeClass();
};

describe("@curtain-call/collision.Collision", () => {
  describe("can add shape", () => {
    it("by function", () => {
      const shape = shapeMock();
      const collision = new Collision();

      expect(() => collision.add(shape));
    });

    it("and attach shape trans to self trans", () => {
      const shape = shapeMock();
      jest.spyOn(shape.trans, "attachTo");
      const collision = new Collision();

      collision.add(shape);

      expect(shape.trans.attachTo).toBeCalledWith(collision.trans);
    });
  });

  describe("can remove shape", () => {
    it("by function", () => {
      const shape = shapeMock();
      const collision = new Collision();
      collision.add(shape);

      expect(() => collision.remove(shape));
    });

    it("and detach shape trans", () => {
      const shape = shapeMock();
      jest.spyOn(shape.trans, "detachFromParent");
      const collision = new Collision();

      collision.add(shape);
      collision.remove(shape);

      expect(shape.trans.detachFromParent).toBeCalled();
    });
  });

  it("can deal boxes from shapes", () => {
    const box1: Box2d = [0, 1, 2, 3];
    const shape1 = shapeMock([box1]);
    const box2: Box2d = [4, 5, 6, 7];
    const shape2 = shapeMock([box2]);

    const collision = new Collision();
    collision.add(shape1);
    collision.add(shape2);

    expect(collision.getBox2Ds()).toEqual([box1, box2]);
  });

  describe("can set is-huge-number", () => {
    it("and not huge-number at default", () => {
      const collision = new Collision();

      expect(collision.isHugeNumber()).toBe(false);
    });

    it("and can change by function", () => {
      const collision = new Collision().setIsHugeNumber(true);

      expect(collision.isHugeNumber()).toBe(true);
    });
  });

  it("can owned by actor", () => {
    const owner = jest.fn();
    const collision = new Collision().ownedBy(owner);

    expect(collision.owner()).toBe(owner);
  });

  it("can attach to other", () => {
    const parent = new Transformation();
    const trans = new Transformation();
    jest.spyOn(trans, "attachTo");
    const collision = new Collision(trans).attachTo(parent);

    expect(collision.trans.attachTo).toBeCalledWith(parent);
  });
});
