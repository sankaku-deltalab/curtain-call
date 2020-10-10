import { Asset } from "@curtain-call/asset";
import { Level } from "../src";

export const levelMockClass = jest.fn<Level, []>(() => ({
  load: jest.fn(),
  unload: jest.fn(),
  isLoaded: jest.fn(),
  activate: jest.fn(),
  deactivate: jest.fn(),
  isActive: jest.fn(),
  shouldBeRemovedFromWorld: jest.fn().mockReturnValue(false),
  update: jest.fn(),
}));

export const assetMock = (): Asset => {
  const cls = jest.fn(() => ({
    load: jest.fn(),
    unload: jest.fn(),
    isLoaded: jest.fn(),
  }));
  return new cls();
};
