import * as PIXI from "pixi.js";
import { PixiAsset } from "../src";

const loaderMock = (): PIXI.Loader => {
  const loader = new PIXI.Loader();
  loader.add = jest.fn();
  loader.load = jest.fn().mockImplementation((cb) => cb());
  loader.reset = jest.fn();
  return loader;
};

describe("@curtain-call/asset.PixiAsset", () => {
  it("can load", async () => {
    const loader = loaderMock();
    const asset = new PixiAsset(
      { player: "./path/to/pl.jpg", enemy: "./path/to/en.jpg" },
      loader
    );

    await asset.load();

    expect(loader.add).toBeCalledWith("./path/to/pl.jpg", "./path/to/pl.jpg");
    expect(loader.add).toBeCalledWith("./path/to/en.jpg", "./path/to/en.jpg");
    expect(loader.load).toBeCalled();
    expect(asset.get("player")).toBe("./path/to/pl.jpg");
  });

  it("can unload", async () => {
    const loader = loaderMock();
    const asset = new PixiAsset(
      { player: "./path/to/pl.jpg", enemy: "./path/to/en.jpg" },
      loader
    );

    await asset.load();
    asset.unload();

    expect(loader.reset).toBeCalled();
  });

  it("can not get image while unloaded", async () => {
    const loader = loaderMock();
    const asset = new PixiAsset(
      { player: "./path/to/pl.jpg", enemy: "./path/to/en.jpg" },
      loader
    );

    await asset.load();
    asset.unload();

    expect(() => asset.get("player")).toThrowError();
  });
});
