import * as PIXI from "pixi.js";
import { Actor } from "@curtain-call/actor";
import { Scene } from "../src";

const containerMock = (): PIXI.Container => {
  const container = new PIXI.Container();
  jest.spyOn(container, "addChild");
  jest.spyOn(container, "removeChild");
  return container;
};

const sceneWithMock = <T>(): {
  sceneHead: PIXI.Container;
  sceneTail: PIXI.Container;
  scene: Scene<T>;
} => {
  const sceneHead = containerMock();
  const sceneTail = containerMock();
  const scene = new Scene(sceneHead, sceneTail);
  return { sceneHead, sceneTail, scene };
};

describe("@curtain-call/scene.Scene", () => {
  it("can be constructed without args", () => {
    expect(() => new Scene()).not.toThrowError();
  });

  describe("can add actor", () => {
    it("with actor container", () => {
      const { scene, sceneTail } = sceneWithMock();

      const actor = new Actor();
      scene.addActor(actor);

      expect(sceneTail.addChild).toBeCalledWith(actor.container);
    });

    it("but throw error when add already added actor", () => {
      const { scene } = sceneWithMock();

      const actor = new Actor();
      scene.addActor(actor);
      expect(() => scene.addActor(actor)).toThrowError();
    });
  });

  describe("can remove actor", () => {
    it("with actor container", () => {
      const { scene, sceneTail } = sceneWithMock();

      const actor = new Actor();
      scene.addActor(actor);
      scene.removeActor(actor);

      expect(sceneTail.removeChild).toBeCalledWith(actor.container);
    });

    it("but throw error when remove not added actor", () => {
      const { scene } = sceneWithMock();

      const actor = new Actor();
      expect(() => scene.removeActor(actor)).toThrowError();
    });
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
