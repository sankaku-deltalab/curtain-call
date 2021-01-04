import {
  Box2d,
  CollisionGroup,
  CollisionRepresentation,
} from "@curtain-call/entity";
import { CollisionOverlapCheckerImpl, BoxIntersect } from "../src";

export const boxIntersectMockClass = jest.fn<
  BoxIntersect,
  [Partial<BoxIntersect>]
>((option: Partial<BoxIntersect>) =>
  Object.assign(
    {
      calcIntersectAllVsAll: jest.fn(),
      calcIntersectAlphaVsBeta: jest.fn(),
    },
    option
  )
);

/**
 * Overlap all.
 */
class BoxIntersectMockAll implements BoxIntersect {
  calcIntersectAllVsAll(boxes: readonly Box2d[]): [number, number][] {
    const overlapping: [number, number][] = [];
    boxes.forEach((_, i) =>
      boxes.forEach((_, j) => {
        if (i === j) return;
        overlapping.push([i, j]);
        overlapping.push([j, i]);
      })
    );
    return overlapping;
  }

  calcIntersectAlphaVsBeta(
    boxesAlpha: readonly Box2d[],
    boxesBeta: readonly Box2d[]
  ): [number, number][] {
    const overlapping: [number, number][] = [];
    boxesAlpha.forEach((_, i) =>
      boxesBeta.forEach((_, j) => {
        if (i === j) return;
        overlapping.push([i, j]);
        overlapping.push([j, i]);
      })
    );
    return overlapping;
  }
}

// 1 -> 1, 2, 3, 4
// 2 -> 2, 3, 4
// 3 -> 3, 4
// 4 -> 4
// 5 -> None
const group1 = { category: 0b0001, mask: 0b1111 };
const group2 = { category: 0b0010, mask: 0b1110 };
const group3 = { category: 0b0100, mask: 0b1100 };
const group4 = { category: 0b1000, mask: 0b1000 };
const group5 = { category: 0b0000, mask: 0b0000 };

const createCollision = (
  group: CollisionGroup,
  isExcess: boolean
): CollisionRepresentation => ({
  box2ds: [[0, 0, 1, 1]],
  group,
  isExcess,
});

describe("@curtain-call/ia-collision", () => {
  it("not-excess collision can overlap if group can collide", () => {
    const col1 = createCollision(group1, false);
    const col2 = createCollision(group2, false);
    const col3 = createCollision(group3, false);
    const col4 = createCollision(group4, false);
    const col5 = createCollision(group5, false);

    const checker = new CollisionOverlapCheckerImpl(new BoxIntersectMockAll());
    const r = checker.calcOverlapAllVsAll(
      new Set([col1, col2, col3, col4, col5])
    );

    expect(r.get(col1)).toEqual([col2, col3, col4]);
    expect(r.get(col2)).toEqual([col3, col4]);
    expect(r.get(col3)).toEqual([col4]);
    expect(r.get(col4)).toBeUndefined();
    expect(r.get(col5)).toBeUndefined();
  });

  it("excess collision can not overlap each other", () => {
    const col1 = createCollision(group1, true);
    const col2 = createCollision(group1, true);

    const checker = new CollisionOverlapCheckerImpl(new BoxIntersectMockAll());
    const r = checker.calcOverlapAllVsAll(new Set([col1, col2]));

    expect(r.get(col1)).toBeUndefined();
    expect(r.get(col2)).toBeUndefined();
  });
});
