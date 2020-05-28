import { StaticLevel } from "../../src";
import { Actor } from "@curtain-call/actor";
import { World } from "@curtain-call/world";
import { Asset } from "@curtain-call/asset";

const actorMock = <T>(): Actor<T> => {
  const actor = new Actor<T>();
  jest.spyOn(actor.trans, "attachTo");
  jest.spyOn(actor.trans, "detachFromParent");
  return actor;
};

const worldMock = (): World => {
  const world = new World();
  jest.spyOn(world, "addActor");
  jest.spyOn(world, "removeActor");
  return world;
};

const assetMock = (): Asset => {
  const cls = jest.fn(() => ({
    load: jest.fn(),
    unload: jest.fn(),
    isLoaded: jest.fn(),
  }));
  return new cls();
};

const createStaticLevel = <T extends World>(): {
  assets: readonly Asset[];
  actors: readonly Actor<T>[];
  level: StaticLevel<T>;
} => {
  const assets: Asset[] = [assetMock(), assetMock()];
  const actors: Actor<T>[] = [actorMock(), actorMock()];
  const level = new StaticLevel(assets, () => actors);
  return {
    assets,
    actors,
    level,
  };
};

describe("@curtain-call/contents.StaticLevel", () => {
  it("create actors and add to world as background actor", async () => {
    const { actors, level } = createStaticLevel();

    const world = worldMock();
    await level.load();
    level.activate(world);

    actors.forEach((actor) => {
      expect(actor.trans.attachTo).toBeCalledWith(world.backgroundTrans);
      expect(world.addActor).toBeCalledWith(actor);
    });
  });

  it("remove created actors", async () => {
    const { actors, level } = createStaticLevel();

    const world = worldMock();
    await level.load();
    level.activate(world);
    level.deactivate(world);

    actors.forEach((actor) => {
      expect(actor.trans.detachFromParent).toBeCalled();
      expect(world.removeActor).toBeCalledWith(actor);
    });
  });

  it("load assets", async () => {
    const { assets, level } = createStaticLevel();

    await level.load();

    assets.forEach((asset) => {
      expect(asset.load).toBeCalled();
    });
  });

  it("unload assets", async () => {
    const { assets, level } = createStaticLevel();

    await level.load();
    level.unload();

    assets.forEach((asset) => {
      expect(asset.unload).toBeCalled();
    });
  });
});
