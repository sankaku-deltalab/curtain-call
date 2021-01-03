import "jest";
import { WorldBase } from "@curtain-call/entity";

export const worldBaseMockClass = jest.fn<WorldBase, [Partial<WorldBase>]>(
  (option: Partial<WorldBase>) =>
    Object.assign(
      {
        on: jest.fn(),
        once: jest.fn(),
        off: jest.fn(),
        setDrawAreaUpdater: jest.fn(),
        update: jest.fn(),
        addActor: jest.fn(),
        removeActor: jest.fn(),
        hasActor: jest.fn(),
        iterateActors: jest.fn(),
        boundsIsInCoreArea: jest.fn(),
        boundsIsNotInCoreArea: jest.fn(),
        addHitStop: jest.fn(),
        addTimeScaling: jest.fn(),
        removeTimeScaling: jest.fn(),
        getExtensions: jest.fn(),
        getOneExtension: jest.fn(),
      },
      option
    )
);
