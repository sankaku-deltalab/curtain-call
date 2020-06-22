import * as PIXI from "pixi.js";
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
});
