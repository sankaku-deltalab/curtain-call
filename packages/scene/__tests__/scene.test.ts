import * as PIXI from "pixi.js";
import { Actor } from "@curtain-call/actor";
import { Sprite, DisplayObjectContainer } from "@curtain-call/display-object";
import { Scene } from "../src";
import { Camera } from "@curtain-call/camera/src";

const containerMock = (): PIXI.Container => {
  const container = new PIXI.Container();
  jest.spyOn(container, "addChild");
  jest.spyOn(container, "removeChild");
  return container;
};

const sceneWithMock = <T>(): {
  sceneHead: PIXI.Container;
  sceneTail: PIXI.Container;
  pixiDisplayObjectContainer: PIXI.Container;
  displayObjectContainer: DisplayObjectContainer<Scene<T>>;
  pixiCameraHead: PIXI.Container;
  pixiCameraTail: PIXI.Container;
  camera: Camera;
  scene: Scene<T>;
} => {
  const sceneHead = containerMock();
  const sceneTail = containerMock();

  const pixiDisplayObjectContainer = containerMock();
  const displayObjectContainer = new DisplayObjectContainer<Scene<T>>(
    pixiDisplayObjectContainer
  );
  jest.spyOn(displayObjectContainer, "add");
  jest.spyOn(displayObjectContainer, "remove");

  const pixiCameraHead = containerMock();
  const pixiCameraTail = containerMock();
  const camera = new Camera(pixiCameraHead, pixiCameraTail);

  const scene = new Scene(sceneHead, sceneTail, camera, displayObjectContainer);
  return {
    sceneHead,
    sceneTail,
    scene,
    pixiDisplayObjectContainer,
    displayObjectContainer,
    pixiCameraHead,
    pixiCameraTail,
    camera,
  };
};

describe("@curtain-call/scene.Scene", () => {
  it("can be constructed without args", () => {
    expect(() => new Scene()).not.toThrowError();
  });

  describe("can add actor", () => {
    it("by function", () => {
      const { scene } = sceneWithMock();

      const actor = new Actor();

      expect(() => scene.addActor(actor)).not.toThrowError();
    });

    it("but throw error when add already added actor", () => {
      const { scene } = sceneWithMock();

      const actor = new Actor();
      scene.addActor(actor);
      expect(() => scene.addActor(actor)).toThrowError();
    });
  });

  describe("can remove actor", () => {
    it("by function", () => {
      const { scene } = sceneWithMock();

      const actor = new Actor();
      scene.addActor(actor);

      expect(() => scene.removeActor(actor)).not.toThrowError();
    });

    it("but throw error when remove not added actor", () => {
      const { scene } = sceneWithMock();

      const actor = new Actor();
      expect(() => scene.removeActor(actor)).toThrowError();
    });
  });

  describe("use DisplayObject", () => {
    const actorMock = <T>(): { actor: Actor<T>; sprite: Sprite<T> } => {
      const actor = new Actor();
      const sprite = new Sprite();
      actor.displayObjects.add(sprite);
      return { actor, sprite };
    };

    it("and DisplayObjectContainer's pixi container was added to scene at constructor", () => {
      const { sceneTail, pixiDisplayObjectContainer } = sceneWithMock();

      expect(sceneTail.addChild).toBeCalledWith(pixiDisplayObjectContainer);
    });

    it("and add DisplayObject in actor when updated", () => {
      const { scene, displayObjectContainer } = sceneWithMock();
      const { actor, sprite } = actorMock();

      scene.addActor(actor);
      scene.update({}, 0.125);

      expect(displayObjectContainer.add).toBeCalledWith(sprite);
    });

    it("and remove DisplayObject in actor when actor removed", () => {
      const { scene, displayObjectContainer } = sceneWithMock();
      const { actor, sprite } = actorMock();

      scene.addActor(actor);
      scene.update({}, 0.125);
      scene.removeActor(actor);

      expect(displayObjectContainer.remove).toBeCalledWith(sprite);
    });
  });

  it("use camera", () => {
    const { scene, camera } = sceneWithMock();
    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(1, 2);
    scene.tail.addChild(obj);

    camera.moveTo({ x: 3, y: 1 });
    const viewPos = obj.getGlobalPosition();

    expect(viewPos.x).toBeCloseTo(-2);
    expect(viewPos.y).toBeCloseTo(1);
  });

  it("can update added actors", () => {
    const { scene } = sceneWithMock();
    const actor = new Actor();
    jest.spyOn(actor, "update").mockImplementation();
    scene.addActor(actor);

    const deltaSec = 0.125;
    scene.update({}, deltaSec);

    expect(actor.update).toBeCalledWith(scene, deltaSec);
  });
});
