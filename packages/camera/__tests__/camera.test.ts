import * as PIXI from "pixi.js";
import { PositionStatusWithArea } from "@curtain-call/util";
import { Camera } from "../src";

describe("@curtain-call/camera.Camera", () => {
  it("can move", () => {
    const camera = new Camera();
    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(1, 2);
    camera.tail.addChild(obj);

    camera.moveTo({ x: 3, y: 1 });
    camera.update();
    const viewPos = obj.getGlobalPosition();

    expect(viewPos.x).toBeCloseTo(-2);
    expect(viewPos.y).toBeCloseTo(1);
  });

  it("can rotate", () => {
    const camera = new Camera();
    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(1, 2);
    camera.tail.addChild(obj);

    camera.moveTo({ x: 3, y: 1 });
    camera.rotateTo(Math.PI / 2);
    camera.update();
    const viewPos = obj.getGlobalPosition();

    expect(viewPos.x).toBeCloseTo(1);
    expect(viewPos.y).toBeCloseTo(2);
  });

  it("can zoom", () => {
    const camera = new Camera();
    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(1, 2);
    camera.tail.addChild(obj);

    camera.moveTo({ x: 3, y: 1 });
    camera.zoomTo(2);
    camera.update();
    const viewPos = obj.getGlobalPosition();

    expect(viewPos.x).toBeCloseTo(-4);
    expect(viewPos.y).toBeCloseTo(2);
  });

  it.each`
    status                               | pos                 | radius
    ${PositionStatusWithArea.inArea}     | ${{ x: 0, y: 0 }}   | ${0.9}
    ${PositionStatusWithArea.onAreaEdge} | ${{ x: 0, y: 0 }}   | ${1.1}
    ${PositionStatusWithArea.onAreaEdge} | ${{ x: -1, y: -1 }} | ${0}
    ${PositionStatusWithArea.outOfArea}  | ${{ x: -2, y: -2 }} | ${0.9}
  `("can calc position status with visible area", ({ status, pos, radius }) => {
    const camera = new Camera()
      .setCameraResolution({ x: 12, y: 8 })
      .moveTo({ x: 1, y: 2 })
      .rotateTo(Math.PI / 2)
      .zoomTo(2);

    expect(camera.calcVisibilityStatus(pos, radius)).toBe(status);
  });
});
