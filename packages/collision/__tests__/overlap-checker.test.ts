import { Collision } from "@curtain-call/actor";
import { collisionMockClass } from "./mocks";
import { Box2d, OverlapChecker } from "../src";

const collisionMock = (isHuge: boolean, boxes: Box2d[] = []): Collision => {
  const collision = new collisionMockClass();
  jest.spyOn(collision, "isEnabled").mockReturnValue(true);
  jest.spyOn(collision, "canCollideWith").mockReturnValue(true);
  jest.spyOn(collision, "isHugeNumber").mockReturnValue(isHuge);
  jest.spyOn(collision, "getBox2Ds").mockReturnValue(boxes);
  return collision;
};

describe("@curtain-call/collision.OverlapChecker", () => {
  describe("can check overlapping", () => {
    it("with non-huge number collisions", () => {
      const col1 = collisionMock(false, [[0, 0, 10, 10]]);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);

      const r = new OverlapChecker().checkOverlap([col1, col2]);

      expect(r.get(col1)).toStrictEqual(new Set([col2]));
      expect(r.get(col2)).toStrictEqual(new Set([col1]));
    });

    it("but huge number collisions will not overlap", () => {
      const col1 = collisionMock(false, [[0, 0, 10, 10]]);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);
      const col3 = collisionMock(true, [[0, 0, 20, 20]]);
      const col4 = collisionMock(true, [[0, 0, 20, 20]]);

      const r = new OverlapChecker().checkOverlap([col1, col2, col3, col4]);

      expect(r.get(col1)).toStrictEqual(new Set([col2, col3, col4]));
      expect(r.get(col2)).toStrictEqual(new Set([col1, col3, col4]));
      expect(r.get(col3)).toStrictEqual(new Set([col1, col2]));
      expect(r.get(col4)).toStrictEqual(new Set([col1, col2]));
    });

    it("but not enabled collision will not overlap", () => {
      const col1 = collisionMock(false, [[0, 0, 10, 10]]);
      jest.spyOn(col1, "isEnabled").mockReturnValue(false);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);
      const col3 = collisionMock(true, [[0, 0, 20, 20]]);

      const r = new OverlapChecker().checkOverlap([col1, col2, col3]);

      expect(r.get(col1)).toBeUndefined();
      expect(r.get(col2)).toStrictEqual(new Set([col3]));
      expect(r.get(col3)).toStrictEqual(new Set([col2]));
    });

    it("and only collide with canCollide to other", () => {
      const col1 = collisionMock(false, [[0, 0, 10, 10]]);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);
      const col3 = collisionMock(false, [[0, 0, 20, 20]]);
      jest
        .spyOn(col1, "canCollideWith")
        .mockImplementation((other) => other == col2);
      jest
        .spyOn(col2, "canCollideWith")
        .mockImplementation((other) => other == col3);

      const r = new OverlapChecker().checkOverlap([col1, col2, col3]);

      expect(r.get(col1)).toStrictEqual(new Set([col2]));
      expect(r.get(col2)).toStrictEqual(new Set([col3]));
    });
  });
});
