import "reflect-metadata";
import { container } from "tsyringe";
import { Transformation } from "@curtain-call/actor";
import { collisionShapeMockClass, transMockClass } from "./mocks";
import { Collision, Box2d } from "../src";

const createCollision = (): {
  trans: Transformation;
  collision: Collision;
} => {
  const trans = new transMockClass();
  const collision = new Collision(trans);
  return { trans, collision };
};

describe("@curtain-call/collision.Collision", () => {
  beforeEach(() => {
    container.register("Transformation", transMockClass);
  });

  afterEach(() => {
    container.reset();
  });

  it("can construct without args", () => {
    expect(() => new Collision()).not.toThrowError();
  });

  describe("can add shape", () => {
    it("by function", () => {
      const shape = new collisionShapeMockClass();
      const collision = createCollision().collision;

      expect(() => collision.addShape(shape));
    });

    it("and attach shape trans to self trans", () => {
      const shape = new collisionShapeMockClass();
      const { trans, collision } = createCollision();
      jest.spyOn(trans, "attachChild");

      collision.addShape(shape);

      expect(trans.attachChild).toBeCalledWith(shape.trans, false);
    });
  });

  describe("can remove shape", () => {
    it("by function", () => {
      const shape = new collisionShapeMockClass();
      const collision = createCollision().collision;
      collision.addShape(shape);

      expect(() => collision.removeShape(shape));
    });

    it("and detach shape trans", () => {
      const shape = new collisionShapeMockClass();
      const { trans, collision } = createCollision();
      jest.spyOn(trans, "detachChild");

      collision.addShape(shape);
      collision.removeShape(shape);

      expect(trans.detachChild).toBeCalledWith(shape.trans, false);
    });
  });

  it("can deal boxes from shapes", () => {
    const box1: Box2d = [0, 1, 2, 3];
    const box2: Box2d = [4, 5, 6, 7];
    const shape1 = new collisionShapeMockClass();
    const shape2 = new collisionShapeMockClass();
    jest.spyOn(shape1, "getBox2Ds").mockReturnValue([box1]);
    jest.spyOn(shape2, "getBox2Ds").mockReturnValue([box2]);

    const collision = createCollision().collision;
    collision.addShape(shape1);
    collision.addShape(shape2);

    expect(collision.getBox2Ds()).toEqual([box1, box2]);
  });

  describe("can set is-huge-number", () => {
    it("and not huge-number at default", () => {
      const collision = createCollision().collision;

      expect(collision.isHugeNumber()).toBe(false);
    });

    it("and can change by function", () => {
      const collision = createCollision().collision.setIsHugeNumber(true);

      expect(collision.isHugeNumber()).toBe(true);
    });
  });
});
