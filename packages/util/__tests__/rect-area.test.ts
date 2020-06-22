import { Matrix } from "trans-vector2d";
import { RectArea, PositionStatusWithArea, Transformation } from "../src";

describe("@curtain-call/util.RectArea", () => {
  it.each`
    status                               | pos                 | radius
    ${PositionStatusWithArea.inArea}     | ${{ x: 1, y: 1 }}   | ${0.9}
    ${PositionStatusWithArea.onAreaEdge} | ${{ x: -1, y: -1 }} | ${1.1}
    ${PositionStatusWithArea.onAreaEdge} | ${{ x: 0, y: 0 }}   | ${0}
    ${PositionStatusWithArea.outOfArea}  | ${{ x: 6, y: 8 }}   | ${1}
  `("calc given position is $status", ({ status, pos, radius }) => {
    const areaParentTrans = new Transformation().setLocal(
      Matrix.from({ translation: { x: 1, y: 2 } })
    );
    const area = new RectArea()
      .init({ x: -1, y: -2 }, { x: 3, y: 4 })
      .attachTo(areaParentTrans);

    expect(area.calcPositionStatus(pos, radius)).toBe(status);
  });
});
