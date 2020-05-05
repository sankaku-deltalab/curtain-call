import { Collision, Box2d, OverlapChecker } from "../src";

const collisionMock = <T>(
  isHuge: boolean,
  boxes: Box2d[] = []
): Collision<T> => {
  const collision = new Collision<T>().setIsHugeNumber(isHuge);
  jest.spyOn(collision, "getBox2Ds").mockReturnValue(boxes);
  jest.spyOn(collision.event, "emit");
  return collision;
};

describe("@curtain-call/collision.OverlapChecker", () => {
  describe("can check overlapping", () => {
    it("with non-huge number collisions", () => {
      const scene = {};
      const col1 = collisionMock(false, [[0, 0, 10, 10]]);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);

      const oc = new OverlapChecker();
      oc.checkOverlap(scene, [col1, col2]);

      expect(col1.event.emit).toBeCalledWith(
        "overlapped",
        scene,
        new Set([col2])
      );

      expect(col2.event.emit).toBeCalledWith(
        "overlapped",
        scene,
        new Set([col1])
      );
    });

    it("but huge number collisions will not overlap", () => {
      const scene = {};
      const col1 = collisionMock(false, [[0, 0, 10, 10]]);
      const col2 = collisionMock(false, [[5, 5, 15, 15]]);
      const col3 = collisionMock(true, [[0, 0, 20, 20]]);
      const col4 = collisionMock(true, [[0, 0, 20, 20]]);

      const oc = new OverlapChecker();
      oc.checkOverlap(scene, [col1, col2, col3, col4]);

      expect(col1.event.emit).toBeCalledWith(
        "overlapped",
        scene,
        new Set([col2, col3, col4])
      );

      expect(col2.event.emit).toBeCalledWith(
        "overlapped",
        scene,
        new Set([col1, col3, col4])
      );

      expect(col3.event.emit).toBeCalledWith(
        "overlapped",
        scene,
        new Set([col1, col2])
      );

      expect(col4.event.emit).toBeCalledWith(
        "overlapped",
        scene,
        new Set([col1, col2])
      );
    });
  });
});
