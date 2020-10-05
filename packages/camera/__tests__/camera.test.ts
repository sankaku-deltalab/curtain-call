import "reflect-metadata";
import { container } from "tsyringe";
import * as PIXI from "pixi.js";
import { PositionInAreaStatus } from "@curtain-call/actor";
import { createCamera, transMockClass, rectAreaMockClass } from "./mock";
import { Matrix } from "trans-vector2d";
import { Camera } from "../../curtain-call/dist/camera";

describe("@curtain-call/camera.Camera", () => {
  beforeEach(() => {
    container.register("Transformation", transMockClass);
    container.register("PIXI.Container", PIXI.Container);
    container.register("RectArea", rectAreaMockClass);
  });

  afterEach(() => {
    container.reset();
  });

  it("can construct without args", () => {
    expect(() => new Camera()).not.toThrowError();
  });

  it("can move", () => {
    const camera = createCamera().camera;
    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(1, 2);
    camera.pixiTail.addChild(obj);

    const setLocal = jest.spyOn(camera.trans, "setLocal");
    camera.moveTo({ x: 3, y: 1 });

    expect(
      setLocal.mock.calls[0][0].isClosedTo(Matrix.translation({ x: 3, y: 1 }))
    ).toBe(true);
  });

  it("can rotate", () => {
    const camera = createCamera().camera;
    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(1, 2);
    camera.pixiTail.addChild(obj);

    camera.rotateTo(Math.PI / 2);

    expect(camera.trans.setLocal).toBeCalledWith(Matrix.rotation(Math.PI / 2));
  });

  it("can zoom", () => {
    const camera = createCamera().camera;
    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(1, 2);
    camera.pixiTail.addChild(obj);

    const setLocal = jest.spyOn(camera.trans, "setLocal");
    camera.zoomTo(2);

    expect(
      setLocal.mock.calls[0][0].isClosedTo(
        Matrix.scaling({ x: 1 / 2, y: 1 / 2 })
      )
    ).toBe(true);
  });

  it("update pixi objects when updated", () => {
    const { camera, trans, pixiHead, pixiTail } = createCamera();
    jest.spyOn(trans, "getGlobal").mockReturnValue(
      Matrix.from({
        translation: { x: 1, y: 2 },
        rotation: 3,
        scale: { x: 1 / 4, y: 1 / 4 },
      })
    );
    camera.update();

    expect(pixiTail.position.x).toBeCloseTo(-1);
    expect(pixiTail.position.y).toBeCloseTo(-2);
    expect(pixiHead.rotation).toEqual(-3);
    expect(pixiHead.scale.x).toBeCloseTo(4);
    expect(pixiHead.scale.y).toBeCloseTo(4);
  });

  it("attach visible area at constructor", () => {
    const { camera, visibleArea } = createCamera();

    expect(camera.trans.attachChild).toBeCalledWith(visibleArea.trans, false);
  });

  it("use visible area", () => {
    const { camera, visibleArea } = createCamera();
    jest
      .spyOn(visibleArea, "calcPositionStatus")
      .mockReturnValue(PositionInAreaStatus.inArea);

    const pos = { x: 1, y: 2 };
    const radius = 3;
    const r = camera.calcVisibilityStatus(pos, radius);

    expect(r).toBe(PositionInAreaStatus.inArea);
    expect(visibleArea.calcPositionStatus).toBeCalledWith(pos, radius);
  });
});
