import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
import { Matrix, Vector } from "trans-vector2d";
import {
  PointerInputReceiver,
  Engine,
  World,
  Mover,
  PointerInputReceiverEvent,
} from "@curtain-call/actor";
import {} from "@curtain-call/actor-test-mocks";

export const containerMock = (): PIXI.Container => {
  const container = new PIXI.Container();
  jest.spyOn(container, "addChild");
  jest.spyOn(container, "removeChild");
  return container;
};

export const spriteMock = (): PIXI.Sprite => {
  return new PIXI.Sprite();
};

export const pointerInputReceiverMockClass = jest.fn<PointerInputReceiver, []>(
  () => ({
    event: new EventEmitter() as PointerInputReceiverEvent,
    setModifier: jest.fn().mockReturnThis(),
    addChild: jest.fn().mockReturnThis(),
    removeChild: jest.fn().mockReturnThis(),
    notifyDown: jest.fn(),
    notifyUp: jest.fn(),
    notifyTap: jest.fn(),
    notifyMove: jest.fn(),
  })
);

export const engineMockClass = jest.fn<Engine, []>(() => ({
  event: new EventEmitter<{}>(),
  canvasSize: jest.fn().mockReturnValue(new Vector(2, 2)),
  addWorld: jest.fn().mockReturnThis(),
  removeWorld: jest.fn().mockReturnThis(),
  destroy: jest.fn(),
}));

export const moverMockClass = jest.fn<Mover, [boolean, Vector]>(
  (done: boolean, delta: Vector) => ({
    update: jest
      .fn()
      .mockImplementation(
        (world: World, deltaSec: number, currentTrans: Matrix) => ({
          done,
          newTrans: currentTrans.translated(delta),
        })
      ),
  })
);
