import "reflect-metadata";
import { Matrix, Vector } from "trans-vector2d";
import { container } from "tsyringe";
import { PositionInAreaStatus } from "@curtain-call/actor";
import { RectArea, Transformation } from "../src";

describe("@curtain-call/util.RectArea", () => {
  beforeEach(() => {
    container.register("Transformation", Transformation);
  });

  afterEach(() => {
    container.reset();
  });

  it.each`
    status                             | pos                 | radius
    ${PositionInAreaStatus.inArea}     | ${{ x: 0, y: 0 }}   | ${0.9}
    ${PositionInAreaStatus.onAreaEdge} | ${{ x: 0, y: 0 }}   | ${1.1}
    ${PositionInAreaStatus.onAreaEdge} | ${{ x: -1, y: -1 }} | ${0}
    ${PositionInAreaStatus.outOfArea}  | ${{ x: -2, y: -2 }} | ${0.9}
  `("calc given position is $status", ({ status, pos, radius }) => {
    const areaParentTrans = new Transformation().setLocal(
      Matrix.from({
        translation: { x: 1, y: 2 },
        rotation: Math.PI / 2,
        scale: Vector.one.mlt(0.5),
      })
    );
    const area = new RectArea(new Transformation()).init(
      { x: -6, y: -4 },
      { x: 6, y: 4 }
    );
    areaParentTrans.attachChild(area.trans, false);

    expect(area.calcPositionStatus(pos, radius)).toBe(status);
  });
});
