import * as PIXI from "pixi.js";
import { Vector } from "trans-vector2d";
import { Actor } from "@curtain-call/actor";
import { Sprite, DisplayObjectManager } from "@curtain-call/display-object";
import { Camera } from "@curtain-call/camera";
import {
  Updatable,
  Transformation,
  PositionStatusWithArea,
} from "@curtain-call/util";
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

const worldWithMock = (): {
  diArgs: {
    readonly head: PIXI.Container;
    readonly tail: PIXI.Container;
    readonly camera: Camera;
    readonly displayObject: DisplayObjectManager;
    readonly pointerInput: PointerInputReceiver<World>;
  };
  world: World;
} => {
  const worldHead = containerMock();
  const worldTail = containerMock();

  const pixiDisplayObjectContainer = containerMock();
  const DisplayObjectContainer = new DisplayObjectManager(
    pixiDisplayObjectContainer
  );

  const pixiCameraHead = containerMock();
  const pixiCameraTail = containerMock();
  const camera = new Camera(
    new Transformation(),
    pixiCameraHead,
    pixiCameraTail
  );

  const diArgs = {
    head: worldHead,
    tail: worldTail,
    camera,
    displayObject: DisplayObjectContainer,
    pointerInput: new PointerInputReceiver<World>(),
  };

  const world = new World(diArgs);

  const engineLikeContainer = new PIXI.Container();
  engineLikeContainer.addChild(world.head);

  return { diArgs, world };
};

describe("@curtain-call/world.World", () => {
  it("can be constructed without args", () => {
    expect(() => new World()).not.toThrowError();
  });

  it("can set draw area in canvas", () => {
    const gameHeight = 400;
    const gameWidth = 300;
    const canvasHeight = 1000;
    const canvasWidth = 600;
    const gameUnitPerPixel = 2;
    const world = new World().setDrawArea(
      { x: canvasWidth / 2, y: canvasHeight / 2 },
      { x: gameWidth / gameUnitPerPixel, y: gameHeight / gameUnitPerPixel },
      gameUnitPerPixel
    );

    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(2, 3);
    world.tail.addChild(obj);

    const canvasPos = obj.getGlobalPosition();
    expect(canvasPos.x).toBeCloseTo(300 + 2 * gameUnitPerPixel);
    expect(canvasPos.y).toBeCloseTo(500 + 3 * gameUnitPerPixel);
  });

  it("emit updated event", () => {
    const world = new World();

    const ev = jest.fn();
    world.event.on("updated", ev);

    const deltaSec = 123;
    world.update(deltaSec);

    expect(ev).toBeCalledWith(deltaSec);
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

    it("and sub-actors were added too", () => {
      const world = new World();
      const subActors = [new Actor<typeof world>(), new Actor<typeof world>()];
      const actor = new Actor<typeof world>().addSubActor(...subActors);

      world.addActor(actor);

      subActors.forEach((sub) => {
        expect(world.hasActor(sub)).toBe(true);
      });
    });

    it("and sub-actors were removed too", () => {
      const world = new World();
      const subActors = [new Actor<typeof world>(), new Actor<typeof world>()];
      const actor = new Actor<typeof world>().addSubActor(...subActors);

      world.addActor(actor);
      world.removeActor(actor);

      subActors.forEach((sub) => {
        expect(world.hasActor(sub)).toBe(false);
      });
    });

    it("and sub-actors were added after owner was added to world, sub-actors would be added when world updated", () => {
      const world = new World();
      const subActors = [new Actor<typeof world>(), new Actor<typeof world>()];
      const actor = new Actor<typeof world>();
      world.addActor(actor);

      actor.addSubActor(...subActors);
      world.update(1);

      subActors.forEach((sub) => {
        expect(world.hasActor(sub)).toBe(true);
      });
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
      const sprite = new Sprite();
      const actor = new Actor<T>().addDisplayObject(sprite);
      return { actor, sprite };
    };

    it("and DisplayObjectManager's pixi container was added to world at constructor", () => {
      const { diArgs } = worldWithMock();

      expect(diArgs.tail.addChild).toBeCalledWith(
        diArgs.displayObject.container
      );
    });

    it("and add DisplayObject in actor to manager when updated", () => {
      const { world, diArgs } = worldWithMock();
      const { actor, sprite } = actorMock<typeof world>();

      world.addActor(actor);
      world.update(0.125);

      expect(diArgs.displayObject.container.addChild).toBeCalledWith(
        sprite.pixiObj
      );
    });

    it("and remove DisplayObject in actor when DisplayObject was removed from actor", () => {
      const { world, diArgs } = worldWithMock();
      const { actor, sprite } = actorMock<typeof world>();

      world.addActor(actor);
      world.update(0.125);
      actor.removeDisplayObject(sprite);
      world.update(0.125);

      expect(diArgs.displayObject.container.removeChild).toBeCalledWith(
        sprite.pixiObj
      );
    });

    it("and remove DisplayObject in actor when actor removed", () => {
      const { world, diArgs } = worldWithMock();
      const { actor, sprite } = actorMock<typeof world>();

      world.addActor(actor);
      world.update(0.125);
      world.removeActor(actor);
      world.update(0.125);

      expect(diArgs.displayObject.container.removeChild).toBeCalledWith(
        sprite.pixiObj
      );
    });
  });

  it("use camera", () => {
    const { world } = worldWithMock();
    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(1, 2);
    world.tail.addChild(obj);

    world.camera.moveTo({ x: 3, y: 1 });
    world.update(1);
    const viewPos = obj.getGlobalPosition();

    expect(viewPos.x).toBeCloseTo(-2);
    expect(viewPos.y).toBeCloseTo(1);
  });

  it("update camera", () => {
    const { world } = worldWithMock();
    jest.spyOn(world.camera, "update");

    world.update(1);

    expect(world.camera.update).toBeCalled();
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
      world.setDrawArea({ x: 150, y: 200 }, { x: 300, y: 400 }, 2);

      const canvasPos = { x: 152, y: 206 };
      const gamePos = world.canvasPosToGamePos(canvasPos);

      expect(gamePos).toEqual(new Vector(1, 3));
    });

    it("so can convert game position to canvas position", () => {
      const { world } = worldWithMock();
      world.setDrawArea({ x: 150, y: 200 }, { x: 300, y: 400 }, 2);

      const gamePos = { x: 1, y: 3 };
      const canvasPos = world.gamePosToCanvasPos(gamePos);

      expect(canvasPos).toEqual(new Vector(152, 206));
    });
  });

  describe("spread pointer input event", () => {
    it("to added receivers", () => {
      const {
        world,
        diArgs: { pointerInput },
      } = worldWithMock();

      const receiver = new PointerInputReceiver<World>();
      jest.spyOn(receiver, "notifyDown");

      world.addPointerInputReceiver(receiver);
      pointerInput.notifyDown(world, Vector.one);

      expect(receiver.notifyDown).toBeCalledWith(world, Vector.one);
    });

    it("and can remove added receivers", () => {
      const {
        world,
        diArgs: { pointerInput },
      } = worldWithMock();

      const receiver = new PointerInputReceiver<World>();
      jest.spyOn(receiver, "notifyDown");

      world
        .addPointerInputReceiver(receiver)
        .removePointerInputReceiver(receiver);
      pointerInput.notifyDown(world, Vector.one);

      expect(receiver.notifyDown).not.toBeCalled();
    });

    it("and down position was converted to game position from canvas position", () => {
      const {
        world,
        diArgs: { pointerInput },
      } = worldWithMock();

      world.setDrawArea({ x: 200, y: 400 }, { x: 1, y: 1 }, 1 / 2);
      world.camera
        .moveTo({ x: 1, y: 2 })
        .rotateTo(Math.PI / 2)
        .zoomTo(1 / 2);
      world.update(1);

      const receiver = new PointerInputReceiver<World>();
      jest.spyOn(receiver, "notifyDown");
      world.addPointerInputReceiver(receiver);

      const canvasDownPos = new Vector(200 + 2, 400 + 2);
      pointerInput.notifyDown(world, canvasDownPos);

      expect(receiver.notifyDown).toBeCalledWith(world, new Vector(-7, 10));
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
      .addCollisionShape(new RectCollisionShape().setSize({ x: 10, y: 10 }))
      .moveTo({ x: 0, y: 0 });
    const actor2 = new Actor<typeof world>()
      .addCollisionShape(new RectCollisionShape().setSize({ x: 10, y: 10 }))
      .moveTo({ x: 5, y: 5 });
    const actor3 = new Actor<typeof world>()
      .addCollisionShape(new RectCollisionShape().setSize({ x: 10, y: 10 }))
      .moveTo({ x: -21, y: -21 });
    [actor1, actor2, actor3].forEach((ac) => {
      jest.spyOn(ac, "notifyOverlappedWith");
      world.addActor(ac);
    });

    world.update(1);

    expect(actor1.notifyOverlappedWith).toBeCalledWith(
      world,
      new Set([actor2])
    );
    expect(actor2.notifyOverlappedWith).toBeCalledWith(
      world,
      new Set([actor1])
    );
    expect(actor3.notifyOverlappedWith).not.toBeCalled();
  });

  it.each`
    status                               | pos                 | radius
    ${PositionStatusWithArea.inArea}     | ${{ x: 0, y: 0 }}   | ${0.9}
    ${PositionStatusWithArea.onAreaEdge} | ${{ x: 0, y: 0 }}   | ${1.1}
    ${PositionStatusWithArea.onAreaEdge} | ${{ x: -1, y: -2 }} | ${0}
    ${PositionStatusWithArea.outOfArea}  | ${{ x: 4, y: 5 }}   | ${0.9}
  `("has core area", ({ status, pos, radius }) => {
    const world = new World().setCoreArea({ x: -1, y: -2 }, { x: 3, y: 4 });

    expect(world.calcPositionStatusWithCoreArea(pos, radius)).toBe(status);
  });
});
