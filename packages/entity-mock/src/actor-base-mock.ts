import "jest";
import { ActorBase } from "@curtain-call/entity";

export const actorBaseMockClass = jest.fn<ActorBase, [Partial<ActorBase>]>(
  (option: Partial<ActorBase> = {}) =>
    Object.assign(
      {
        team: jest.fn(),
        role: jest.fn(),
        position: jest.fn(),
        rotation: jest.fn(),
        scale: jest.fn(),
        transformation: jest.fn(),
        addMovement: jest.fn().mockReturnThis(),
        calcDrawingObjects: jest.fn(),
        calcCollisionStatus: jest.fn(),
        notifyOverlappedWith: jest.fn(),
        notifyAddedToWorld: jest.fn(),
        notifyRemovedFromWorld: jest.fn(),
        shouldBeRemovedFromWorld: jest.fn(),
        update: jest.fn(),
        aaBB: jest.fn(),
        health: jest.fn(),
        healthMax: jest.fn(),
        takeDamage: jest.fn(),
        isDead: jest.fn(),
        getExtensions: jest.fn(),
        getOneExtension: jest.fn(),
        startTimer: jest.fn(),
      },
      option
    )
);
