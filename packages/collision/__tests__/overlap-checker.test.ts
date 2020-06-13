import { Collision, Box2d, OverlapChecker } from "../src";

const collisionMock = <TWorld, TActor>(
  isHuge: boolean,
  boxes: Box2d[] = []
): Collision<TWorld, TActor> => {
  const collision = new Collision<TWorld, TActor>().setIsHugeNumber(isHuge);
  jest.spyOn(collision, "getBox2Ds").mockReturnValue(boxes);
  jest.spyOn(collision.event, "emit");
  return collision;
};

describe("@curtain-call/collision.OverlapChecker", () => {
  describe("can check overlapping", () => {
    it("with non-huge number collisions", () => {
      const world = {};
      const col1 = collisionMock(false, [[0, 0, 10, 10]]);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);

      const oc = new OverlapChecker();
      oc.checkOverlap(world, [col1, col2]);

      expect(col1.event.emit).toBeCalledWith(
        "overlapped",
        world,
        new Set([col2])
      );

      expect(col2.event.emit).toBeCalledWith(
        "overlapped",
        world,
        new Set([col1])
      );
    });

    it("but huge number collisions will not overlap", () => {
      const world = {};
      const col1 = collisionMock(false, [[0, 0, 10, 10]]);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);
      const col3 = collisionMock(true, [[0, 0, 20, 20]]);
      const col4 = collisionMock(true, [[0, 0, 20, 20]]);

      const oc = new OverlapChecker();
      oc.checkOverlap(world, [col1, col2, col3, col4]);

      expect(col1.event.emit).toBeCalledWith(
        "overlapped",
        world,
        new Set([col2, col3, col4])
      );

      expect(col2.event.emit).toBeCalledWith(
        "overlapped",
        world,
        new Set([col1, col3, col4])
      );

      expect(col3.event.emit).toBeCalledWith(
        "overlapped",
        world,
        new Set([col1, col2])
      );

      expect(col4.event.emit).toBeCalledWith(
        "overlapped",
        world,
        new Set([col1, col2])
      );
    });

    it("but not enabled collision will not overlap", () => {
      const world = {};
      const col1 = collisionMock(false, [[0, 0, 10, 10]]).setEnable(false);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);
      const col3 = collisionMock(true, [[0, 0, 20, 20]]);

      const oc = new OverlapChecker();
      oc.checkOverlap(world, [col1, col2, col3]);

      expect(col1.event.emit).not.toBeCalled();

      expect(col2.event.emit).toBeCalledWith(
        "overlapped",
        world,
        new Set([col3])
      );

      expect(col3.event.emit).toBeCalledWith(
        "overlapped",
        world,
        new Set([col2])
      );
    });

    it("but if (a.group().mask & b.group().category) !== 0, a not overlap with b", () => {
      const world = {};
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
      oc.checkOverlap(world, [col1, col2]);

      expect(col1.event.emit).toBeCalledWith(
        "overlapped",
        world,
        new Set([col2])
      );

      expect(col2.event.emit).not.toBeCalled();
    });
  });
});
