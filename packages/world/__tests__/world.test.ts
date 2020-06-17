import * as PIXI from "pixi.js";
import { Vector } from "trans-vector2d";
import { Actor } from "@curtain-call/actor";
import { Sprite, DisplayObjectManager } from "@curtain-call/display-object";
import { Camera } from "@curtain-call/camera";
import { Updatable, Transformation } from "@curtain-call/util";
import { PointerInputReceiver } from "@curtain-call/input";
import { World } from "../src";
import { RectCollisionShape } from "@curtain-call/collision";

const containerMock = (): PIXI.Container => {
  const container = new PIXI.Container();
  jest.spyOn(container, "addChild");
  jest.spyOn(container, "removeChild");
  return container;
};

const updatableMock = <T>(): Updatable<T> => {
  const cls = jest.fn(() => ({
    shouldRemoveSelfFromWorld: jest.fn().mockReturnValue(false),
    update: jest.fn(),
  }));
  return new cls();
};

const worldWithMock = <T>(): {
  worldHead: PIXI.Container;
  worldTail: PIXI.Container;
  pixiDisplayObjectContainer: PIXI.Container;
  displayObjectManager: DisplayObjectManager<World>;
  pixiCameraHead: PIXI.Container;
  pixiCameraTail: PIXI.Container;
  camera: Camera;
  world: World;
} => {
  const worldHead = containerMock();
  const worldTail = containerMock();

  const pixiDisplayObjectContainer = containerMock();
  const DisplayObjectContainer = new DisplayObjectManager<World>(
    pixiDisplayObjectContainer
  );
  jest.spyOn(DisplayObjectContainer, "add");
  jest.spyOn(DisplayObjectContainer, "remove");

  const pixiCameraHead = containerMock();
  const pixiCameraTail = containerMock();
  const camera = new Camera(pixiCameraHead, pixiCameraTail);

  const world = new World(worldHead, worldTail, camera, DisplayObjectContainer);

  const engineLikeContainer = new PIXI.Container();
  engineLikeContainer.addChild(world.head);

  return {
    worldHead,
    worldTail,
    world,
    pixiDisplayObjectContainer,
    displayObjectManager: DisplayObjectContainer,
    pixiCameraHead,
    pixiCameraTail,
    camera,
  };
};

describe("@curtain-call/world.World", () => {
  it("can be constructed without args", () => {
    expect(() => new World()).not.toThrowError();
  });

  it("can update drawing base", () => {
    const { world } = worldWithMock();
    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(1, 2);
    world.tail.addChild(obj);

    world.updateDrawBase({
      center: { x: 3, y: 4 },
      scale: 5,
    });

    const viewPos = obj.getGlobalPosition();
    expect(viewPos.x).toBeCloseTo(8);
    expect(viewPos.y).toBeCloseTo(14);
  });

  describe("can add actor", () => {
    it("by function", () => {
      const { world } = worldWithMock();

      const actor = new Actor<typeof world>();

      expect(() => world.addActor(actor)).not.toThrowError();
    });

    it("and notify it to actor", () => {
      const { world } = worldWithMock();

      const actor = new Actor<typeof world>();
      jest.spyOn(actor, "notifyAddedToWorld");
      world.addActor(actor);

      expect(actor.notifyAddedToWorld).toBeCalledWith(world);
    });

    it("but throw error when add already added actor", () => {
      const { world } = worldWithMock();

      const actor = new Actor<typeof world>();
      world.addActor(actor);
      expect(() => world.addActor(actor)).toThrowError();
    });

    it("and can check actor added", () => {
      const { world } = worldWithMock();

      const actor = new Actor<typeof world>();

      expect(world.hasActor(actor)).toBe(false);

      world.addActor(actor);

      expect(world.hasActor(actor)).toBe(true);
    });

    it("and can iterate added actors", () => {
      const { world } = worldWithMock();

      const actor1 = new Actor<typeof world>();
      const actor2 = new Actor<typeof world>();
      world.addActor(actor1).addActor(actor2);

      const actors = Array.from(world.iterateActors());
      expect(actors).toEqual([actor1, actor2]);
    });
  });

  describe("can remove actor", () => {
    it("by function", () => {
      const { world } = worldWithMock();

      const actor = new Actor<typeof world>();
      world.addActor(actor);

      expect(() => world.removeActor(actor)).not.toThrowError();
    });

    it("and notify it to actor", () => {
      const { world } = worldWithMock();

      const actor = new Actor<typeof world>();
      jest.spyOn(actor, "notifyRemovedFromWorld");
      world.addActor(actor);
      world.removeActor(actor);

      expect(actor.notifyRemovedFromWorld).toBeCalledWith(world);
    });

    it("but throw error when remove not added actor", () => {
      const { world } = worldWithMock();

      const actor = new Actor<typeof world>();
      expect(() => world.removeActor(actor)).toThrowError();
    });
  });

  describe("use DisplayObject", () => {
    const actorMock = <T>(): { actor: Actor<T>; sprite: Sprite<T> } => {
      const actor = new Actor<T>();
      const sprite = new Sprite();
      actor.displayObjects.add(sprite);
      return { actor, sprite };
    };

    it("and DisplayObjectContainer's pixi container was added to world at constructor", () => {
      const { worldTail, pixiDisplayObjectContainer } = worldWithMock();

      expect(worldTail.addChild).toBeCalledWith(pixiDisplayObjectContainer);
    });

    it("and add DisplayObject in actor when updated", () => {
      const {
        world,
        displayObjectManager: DisplayObjectContainer,
      } = worldWithMock();
      const { actor, sprite } = actorMock<typeof world>();

      world.addActor(actor);
      world.update(0.125);

      expect(DisplayObjectContainer.add).toBeCalledWith(sprite);
    });

    it("and remove DisplayObject in actor when actor removed", () => {
      const {
        world,
        displayObjectManager: DisplayObjectContainer,
      } = worldWithMock();
      const { actor, sprite } = actorMock<typeof world>();

      world.addActor(actor);
      world.update(0.125);
      world.removeActor(actor);

      expect(DisplayObjectContainer.remove).toBeCalledWith(sprite);
    });
  });

  it("use camera", () => {
    const { world, camera } = worldWithMock();
    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(1, 2);
    world.tail.addChild(obj);

    camera.moveTo({ x: 3, y: 1 });
    const viewPos = obj.getGlobalPosition();

    expect(viewPos.x).toBeCloseTo(-2);
    expect(viewPos.y).toBeCloseTo(1);
  });

  it("can update added actors", () => {
    const { world } = worldWithMock();
    const actor = new Actor<typeof world>();
    jest.spyOn(actor, "update").mockImplementation();
    world.addActor(actor);

    const deltaSec = 0.125;
    world.update(deltaSec);

    expect(actor.update).toBeCalledWith(world, deltaSec);
  });

  describe("can convert position between canvas and game", () => {
    it("so can convert canvas position to game position", () => {
      const { world } = worldWithMock();
      world.updateDrawBase({ center: { x: 1, y: 2 } });

      const canvasPos = { x: 3, y: 4 };
      const gamePos = world.canvasPosToGamePos(canvasPos);

      expect(gamePos).toEqual(new Vector(2, 2));
    });

    it("so can convert game position to canvas position", () => {
      const { world } = worldWithMock();
      world.updateDrawBase({ center: { x: 1, y: 2 } });

      const gamePos = { x: 3, y: 4 };
      const canvasPos = world.gamePosToCanvasPos(gamePos);

      expect(canvasPos).toEqual(new Vector(4, 6));
    });
  });

  describe("spread pointer input event", () => {
    it("to added receivers", () => {
      const { world } = worldWithMock();
      const receiver = new PointerInputReceiver();
      jest.spyOn(receiver.event, "emit");

      world.addPointerInputReceiver(receiver);
      world.pointerInput.event.emit("down", Vector.one);

      expect(receiver.event.emit).toBeCalledWith("down", Vector.one);
    });

    it("and can remove added receivers", () => {
      const { world } = worldWithMock();
      const receiver = new PointerInputReceiver();
      jest.spyOn(receiver.event, "emit");

      world.addPointerInputReceiver(receiver);
      world.removePointerInputReceiver(receiver);
      world.pointerInput.event.emit("down", Vector.one);

      expect(receiver.event.emit).not.toBeCalled();
    });
  });

  it("can add Updatable objects", () => {
    const { world } = worldWithMock();
    const updatable = updatableMock();

    const deltaSec = 123;
    world.addUpdatable(updatable);
    world.update(deltaSec);

    expect(updatable.update).toBeCalledWith(world, deltaSec);
  });

  it("can remove Updatable objects", () => {
    const { world } = worldWithMock();
    const updatable = updatableMock();

    const deltaSec = 123;
    world.addUpdatable(updatable).removeUpdatable(updatable);
    world.update(deltaSec);

    expect(updatable.update).not.toBeCalled();
  });

  it("can remove Updatable objects should remove", () => {
    const { world } = worldWithMock();
    const updatable1 = updatableMock();
    const updatable2 = updatableMock();
    jest.spyOn(updatable2, "shouldRemoveSelfFromWorld").mockReturnValue(true);

    const deltaSec = 123;
    world.addUpdatable(updatable1).addUpdatable(updatable2);
    world.update(deltaSec);

    expect(updatable1.update).toBeCalled();
    expect(updatable2.update).not.toBeCalled();
  });

  it("has Transformation for background actors", () => {
    const { world } = worldWithMock();
    expect(world.backgroundTrans).toBeInstanceOf(Transformation);
  });

  it("check overlapping when updated", () => {
    const { world } = worldWithMock();
    const actor1 = new Actor<typeof world>()
      .collideWith(new RectCollisionShape().setSize({ x: 10, y: 10 }))
      .moveTo({ x: 0, y: 0 });
    const actor2 = new Actor<typeof world>()
      .collideWith(new RectCollisionShape().setSize({ x: 10, y: 10 }))
      .moveTo({ x: 5, y: 5 });
    const actor3 = new Actor<typeof world>()
      .collideWith(new RectCollisionShape().setSize({ x: 10, y: 10 }))
      .moveTo({ x: -21, y: -21 });
    const actors = [actor1, actor2, actor3];
    actors.forEach((ac) => {
      jest.spyOn(ac.collision.event, "emit");
      world.addActor(ac);
    });

    world.update(1);

    expect(actor1.collision.event.emit).toBeCalledWith(
      "overlapped",
      world,
      new Set([actor2.collision])
    );
    expect(actor2.collision.event.emit).toBeCalledWith(
      "overlapped",
      world,
      new Set([actor1.collision])
    );
    expect(actor3.collision.event.emit).not.toBeCalled();
  });
});
