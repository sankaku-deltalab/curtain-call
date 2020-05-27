import { Asset } from "@curtain-call/asset";
import { Level } from "../src";

export const levelMock = <T>(): Level<T> => {
  const cls = jest.fn(() => ({
    load: jest.fn(),
    unload: jest.fn(),
    isLoaded: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
    isActive: jest.fn(),
    shouldRemoveSelfFromWorld: jest.fn().mockReturnValue(false),
    update: jest.fn(),
  }));
  return new cls();
};

export const assetMock = (): Asset => {
  const cls = jest.fn(() => ({
    load: jest.fn(),
    unload: jest.fn(),
    isLoaded: jest.fn(),
  }));
  return new cls();
};
