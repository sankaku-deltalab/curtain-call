import { Collision, Box2d, OverlapChecker } from "../src";

const collisionMock = (isHuge: boolean, boxes: Box2d[] = []): Collision => {
  const collision = new Collision().setIsHugeNumber(isHuge);
  jest.spyOn(collision, "getBox2Ds").mockReturnValue(boxes);
  return collision;
};

describe("@curtain-call/collision.OverlapChecker", () => {
  describe("can check overlapping", () => {
    it("with non-huge number collisions", () => {
      const col1 = collisionMock(false, [[0, 0, 10, 10]]);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);

      const oc = new OverlapChecker();
      const r = oc.checkOverlap([col1, col2]);

      expect(r.get(col1)).toStrictEqual(new Set([col2]));
      expect(r.get(col2)).toStrictEqual(new Set([col1]));
    });

    it("but huge number collisions will not overlap", () => {
      const col1 = collisionMock(false, [[0, 0, 10, 10]]);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);
      const col3 = collisionMock(true, [[0, 0, 20, 20]]);
      const col4 = collisionMock(true, [[0, 0, 20, 20]]);

      const oc = new OverlapChecker();
      const r = oc.checkOverlap([col1, col2, col3, col4]);

      expect(r.get(col1)).toStrictEqual(new Set([col2, col3, col4]));
      expect(r.get(col2)).toStrictEqual(new Set([col1, col3, col4]));
      expect(r.get(col3)).toStrictEqual(new Set([col1, col2]));
      expect(r.get(col4)).toStrictEqual(new Set([col1, col2]));
    });

    it("but not enabled collision will not overlap", () => {
      const col1 = collisionMock(false, [[0, 0, 10, 10]]).setEnable(false);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);
      const col3 = collisionMock(true, [[0, 0, 20, 20]]);

      const oc = new OverlapChecker();
      const r = oc.checkOverlap([col1, col2, col3]);

      expect(r.get(col1)).toBeUndefined();
      expect(r.get(col2)).toStrictEqual(new Set([col3]));
      expect(r.get(col3)).toStrictEqual(new Set([col2]));
    });

    it("but if (a.group().mask & b.group().category) !== 0, a not overlap with b", () => {
      const collisionGroupA = {
        category: 0b01,
        mask: 0b10,
      };
      const collisionGroupB = {
        category: 0b10,
        mask: 0b00,
      };
      const col1 = collisionMock(false, [[0, 0, 10, 10]]).setGroup(
        collisionGroupA
      );
      const col2 = collisionMock(false, [[5, 5, 15, 15]]).setGroup(
        collisionGroupB
      );

      const oc = new OverlapChecker();
      const r = oc.checkOverlap([col1, col2]);

      expect(r.get(col1)).toStrictEqual(new Set([col2]));
      expect(r.get(col2)).toBeUndefined();
    });
  });
});
