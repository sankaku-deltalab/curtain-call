import * as PIXI from "pixi.js";
import { Vector } from "trans-vector2d";
import {
  Actor,
  diContainer as actorDiContainer,
  PositionInAreaStatus,
  DisplayObject,
} from "@curtain-call/actor";
import {
  transMockClass,
  healthMockClass,
  collisionMockClass,
  displayObjectMockClass,
} from "@curtain-call/actor-test-mocks";
import {
  createWorld,
  engineMockClass,
  pointerInputReceiverMockClass,
} from "./mock";
import EventEmitter from "eventemitter3";

describe("@curtain-call/world.World", () => {
  beforeAll(() => {
    actorDiContainer.register("EventEmitter", EventEmitter);
    actorDiContainer.register("Transformation", transMockClass);
    actorDiContainer.register("FiniteResource", healthMockClass);
    actorDiContainer.register("Collision", collisionMockClass);
  });

  afterAll(() => {
    actorDiContainer.reset();
  });

  it("can set draw area in canvas", () => {
    const gameHeight = 400;
    const gameWidth = 300;
    const gameUnitPerPixel = 1 / 2;
    const { world, camera } = createWorld();
    jest.spyOn(camera, "setCameraResolution");

    world.setDrawAreaUpdater((canvasSize) => ({
      drawCenterInCanvas: canvasSize.div(2),
      drawSizeInCanvas: {
        x: gameWidth / gameUnitPerPixel,
        y: gameHeight / gameUnitPerPixel,
      },
      gameUnitPerPixel,
    }));

    const engine = new engineMockClass();
    const canvasSize = new Vector(600, 1000);
    jest.spyOn(engine, "canvasSize").mockReturnValue(canvasSize);
    world.update(engine, 1);

    const obj = new PIXI.Container();
    obj.position = new PIXI.Point(2, 3);
    world.pixiTail.addChild(obj);
    const canvasPos = obj.getGlobalPosition();
    expect(canvasPos.x).toBeCloseTo(300 + 2 / gameUnitPerPixel);
    expect(canvasPos.y).toBeCloseTo(500 + 3 / gameUnitPerPixel);
    expect(camera.setCameraResolution).toBeCalledWith({
      x: gameWidth,
      y: gameHeight,
    });
  });

  it("emit updated event", () => {
    const world = createWorld().world;

    const ev = jest.fn();
    world.event.on("updated", ev);

    const engine = new engineMockClass();
    const deltaSec = 123;
    world.update(engine, deltaSec);

    expect(ev).toBeCalledWith(deltaSec);
  });

  it("update collision drawer", () => {
    const { world, collisionDrawer } = createWorld();

    const actor = new Actor();
    jest.spyOn(actor.getCollision(), "getBox2Ds").mockReturnValue([]);
    world.addActor(actor);

    world.update(new engineMockClass(), 0);

    expect(collisionDrawer.updateDrawing).toBeCalledWith([
      actor.getCollision(),
    ]);
  });

  it.each`
    enable
    ${true}
    ${false}
  `("can enable collision drawer", ({ enable }) => {
    const { world, collisionDrawer } = createWorld();

    world.setEnableCollisionDrawing(enable);

    expect(collisionDrawer.setEnable).toBeCalledWith(enable);
  });

  describe("can add actor", () => {
    it("by function", () => {
      const { world } = createWorld();
      const actor = new Actor();

      expect(() => world.addActor(actor)).not.toThrowError();
    });

    it("and notify it to actor", () => {
      const { world } = createWorld();

      const actor = new Actor();
      jest.spyOn(actor, "notifyAddedToWorld");
      world.addActor(actor);

      expect(actor.notifyAddedToWorld).toBeCalledWith(world);
    });

    it("but throw error when add already added actor", () => {
      const { world } = createWorld();

      const actor = new Actor();
      world.addActor(actor);
      expect(() => world.addActor(actor)).toThrowError();
    });

    it("and can check actor added", () => {
      const { world } = createWorld();

      const actor = new Actor();

      expect(world.hasActor(actor)).toBe(false);

      world.addActor(actor);

      expect(world.hasActor(actor)).toBe(true);
    });

    it("and can iterate added actors", () => {
      const { world } = createWorld();

      const actor1 = new Actor();
      const actor2 = new Actor();
      world.addActor(actor1).addActor(actor2);

      const actors = Array.from(world.iterateActors());
      expect(actors).toEqual([actor1, actor2]);
    });

    it("and sub-actors were added too", () => {
      const world = createWorld().world;
      const subActors = [new Actor(), new Actor()];
      const subSubActors = [new Actor(), new Actor()];
      subActors[0].addSubActor(...subSubActors);
      const actor = new Actor().addSubActor(...subActors);

      world.addActor(actor);

      subActors.forEach((sub) => {
        expect(world.hasActor(sub)).toBe(true);
      });

      subSubActors.forEach((sub) => {
        expect(world.hasActor(sub)).toBe(true);
      });
    });

    it("and sub-actors were removed too", () => {
      const world = createWorld().world;
      const subActors = [new Actor(), new Actor()];
      const actor = new Actor().addSubActor(...subActors);

      world.addActor(actor);
      world.removeActor(actor);

      subActors.forEach((sub) => {
        expect(world.hasActor(sub)).toBe(false);
      });
    });

    it("and sub-actors were added after owner was added to world, sub-actors would be added when world updated", () => {
      const world = createWorld().world;
      const subActors = [new Actor(), new Actor()];
      const actor = new Actor();
      world.addActor(actor);

      actor.addSubActor(...subActors);

      const engine = new engineMockClass();
      world.update(engine, 1);

      subActors.forEach((sub) => {
        expect(world.hasActor(sub)).toBe(true);
      });
    });
  });

  describe("can remove actor", () => {
    it("by function", () => {
      const { world } = createWorld();

      const actor = new Actor();
      world.addActor(actor);

      expect(() => world.removeActor(actor)).not.toThrowError();
    });

    it("and notify it to actor", () => {
      const { world } = createWorld();

      const actor = new Actor();
      jest.spyOn(actor, "notifyRemovedFromWorld");
      world.addActor(actor);
      world.removeActor(actor);

      expect(actor.notifyRemovedFromWorld).toBeCalledWith(world);
    });

    it("but throw error when remove not added actor", () => {
      const { world } = createWorld();

      const actor = new Actor();
      expect(() => world.removeActor(actor)).toThrowError();
    });
  });

  describe("use DisplayObject", () => {
    const actorMock = (): { actor: Actor; sprite: DisplayObject } => {
      const sprite = new displayObjectMockClass();
      const actor = new Actor().addDisplayObject(sprite);
      return { actor, sprite };
    };

    it("and DisplayObjectManager's pixi container was added to world at constructor", () => {
      const { pixiTail, displayObjectManager } = createWorld();

      expect(pixiTail.addChild).toBeCalledWith(displayObjectManager.container);
    });

    it("and add DisplayObject in actor to manager when updated", () => {
      const { world, displayObjectManager, collisionDrawer } = createWorld();
      const a1 = actorMock();
      const a2 = actorMock();

      world.addActor(a1.actor);
      world.addActor(a2.actor);
      world.update(new engineMockClass(), 0.125);

      expect(displayObjectManager.updatePixiObjects).toBeCalledWith([
        collisionDrawer,
        a1.sprite,
        a2.sprite,
      ]);
    });

    it("and remove DisplayObject in actor when DisplayObject was removed from actor", () => {
      const { world, displayObjectManager, collisionDrawer } = createWorld();
      const { actor, sprite } = actorMock();

      const engine = new engineMockClass();
      world.addActor(actor);
      world.update(engine, 0.125);
      actor.removeDisplayObject(sprite);
      world.update(engine, 0.125);

      expect(displayObjectManager.updatePixiObjects).toHaveBeenLastCalledWith([
        collisionDrawer,
      ]);
    });

    it("and remove DisplayObject in actor when actor removed", () => {
      const { world, displayObjectManager, collisionDrawer } = createWorld();
      const { actor } = actorMock();

      const engine = new engineMockClass();
      world.addActor(actor);
      world.update(engine, 0.125);
      world.removeActor(actor);
      world.update(engine, 0.125);

      expect(displayObjectManager.updatePixiObjects).toHaveBeenLastCalledWith([
        collisionDrawer,
      ]);
    });
  });

  it("head add camera head", () => {
    const { world, camera } = createWorld();
    expect(world.pixiHead.addChild).toBeCalledWith(camera.pixiHead);
  });

  it("tail would be added to camera tail", () => {
    const { world, camera } = createWorld();
    expect(camera.pixiTail.addChild).toBeCalledWith(world.pixiTail);
  });

  it("update camera", () => {
    const { world, camera } = createWorld();
    jest.spyOn(camera, "update");

    world.update(new engineMockClass(), 1);

    expect(camera.update).toBeCalled();
  });

  it("can update added actors", () => {
    const { world } = createWorld();
    const actor = new Actor();
    jest.spyOn(actor, "update").mockImplementation();
    world.addActor(actor);

    const deltaSec = 0.125;
    world.update(new engineMockClass(), deltaSec);

    expect(actor.update).toBeCalledWith(world, deltaSec);
  });

  describe("can convert position between canvas and game", () => {
    it("so can convert canvas position to game position", () => {
      const { world } = createWorld();
      world.setDrawAreaUpdater(() => ({
        drawCenterInCanvas: { x: 150, y: 200 },
        drawSizeInCanvas: { x: 300, y: 400 },
        gameUnitPerPixel: 1 / 2,
      }));
      world.update(new engineMockClass(), 1);

      const canvasPos = { x: 152, y: 206 };
      const gamePos = world.canvasPosToGamePos(canvasPos);

      expect(gamePos).toEqual(new Vector(1, 3));
    });

    it("so can convert game position to canvas position", () => {
      const { world } = createWorld();
      world.setDrawAreaUpdater(() => ({
        drawCenterInCanvas: { x: 150, y: 200 },
        drawSizeInCanvas: { x: 300, y: 400 },
        gameUnitPerPixel: 1 / 2,
      }));
      world.update(new engineMockClass(), 1);

      const gamePos = { x: 1, y: 3 };
      const canvasPos = world.gamePosToCanvasPos(gamePos);

      expect(canvasPos).toEqual(new Vector(152, 206));
    });
  });

  describe("spread pointer input event", () => {
    it("to added receivers", () => {
      const { world, pointerInput } = createWorld();

      const receiver = new pointerInputReceiverMockClass();
      jest.spyOn(receiver, "notifyDown");

      world.addPointerInputReceiver(receiver);
      expect(pointerInput.addChild).toBeCalledWith(receiver);
    });

    it("and can remove added receivers", () => {
      const { world, pointerInput } = createWorld();

      const receiver = new pointerInputReceiverMockClass();
      jest.spyOn(receiver, "notifyDown");

      world
        .addPointerInputReceiver(receiver)
        .removePointerInputReceiver(receiver);
      pointerInput.notifyDown(world, Vector.one);

      expect(receiver.notifyDown).not.toBeCalled();
    });

    it("and down position was converted to game position from canvas position", () => {
      const { world, pointerInput } = createWorld();
      const setMod = jest.spyOn(pointerInput, "setModifier");
      const convertedGamePos = new Vector(1, 2);
      jest.spyOn(world, "canvasPosToGamePos").mockReturnValue(convertedGamePos);

      const receiver = new pointerInputReceiverMockClass();
      world.addPointerInputReceiver(receiver);

      const canvasDownPos = new Vector(3, 4);
      const downPosMod = setMod.mock.calls[0][0];
      const downPos = downPosMod(canvasDownPos);
      expect(downPos).toBe(convertedGamePos);
    });
  });

  it("check overlapping when updated", () => {
    const { world, overlapChecker } = createWorld();
    const a1 = new Actor();
    const a2 = new Actor();
    const a3 = new Actor();

    [a1, a2, a3].forEach((a) => world.addActor(a));

    world.update(new engineMockClass(), 1);
    expect(overlapChecker.checkOverlap).toBeCalledWith([
      a1.getCollision(),
      a2.getCollision(),
      a3.getCollision(),
    ]);
  });

  it("can use core area", () => {
    const nw = { x: -1, y: -2 };
    const se = { x: 3, y: 4 };
    const { world, coreArea } = createWorld();
    world.setCoreArea(nw, se);

    expect(coreArea.init).toBeCalledWith(nw, se);

    jest
      .spyOn(coreArea, "calcPositionStatus")
      .mockReturnValue(PositionInAreaStatus.inArea);
    const status = world.calcPositionStatusWithCoreArea(Vector.one, 3);

    expect(coreArea.calcPositionStatus).toBeCalledWith(Vector.one, 3);
    expect(status).toBe(PositionInAreaStatus.inArea);
  });

  it("can pause and unpause updating", () => {
    const pauser = "player-pause";
    const { world } = createWorld();
    const actor = new Actor();
    jest.spyOn(actor, "update");
    world.addActor(actor);

    world.pause(pauser);
    world.update(new engineMockClass(), 1);
    expect(actor.update).not.toBeCalled();

    world.unpause(pauser);
    world.update(new engineMockClass(), 1);
    expect(actor.update).toBeCalled();
  });

  it("can pause with multiple pauser", () => {
    const pauser1 = "player-pause";
    const pauser2 = "hit-stop-pause";
    const { world } = createWorld();
    const actor = new Actor();
    jest.spyOn(actor, "update");
    world.addActor(actor);

    world.pause(pauser1);
    world.pause(pauser2);
    world.unpause(pauser2);
    world.update(new engineMockClass(), 1);
    expect(actor.update).not.toBeCalled();
  });

  it("emit `updatedWhilePaused` event and not emit `updated` event while paused", () => {
    const pauser = "player-pause";
    const { world } = createWorld();
    const updatedEv = jest.fn();
    world.event.on("updated", updatedEv);
    const updatedWhilePausedEv = jest.fn();
    world.event.on("updatedWhilePaused", updatedWhilePausedEv);

    const engine = new engineMockClass();
    const deltaSec = 0.125;
    world.pause(pauser);
    world.update(engine, deltaSec);

    expect(updatedEv).not.toBeCalled();
    expect(updatedWhilePausedEv).toBeCalledWith(deltaSec);
  });

  it("can scale update time with multiple instigator", () => {
    const scaler1 = "cheat-scale";
    const scale1 = 0.5;
    const scaler2 = "slomo-scale";
    const scale2 = 0.1;
    const { world } = createWorld();
    const actor = new Actor();
    jest.spyOn(actor, "update");
    world.addActor(actor);

    world.addTimeScaler(scaler1, scale1);
    world.addTimeScaler(scaler2, scale2);
    const engine = new engineMockClass();
    const deltaSec = 0.125;
    world.update(engine, deltaSec);

    expect(actor.update).toBeCalledWith(world, deltaSec * scale1 * scale2);
  });
});
