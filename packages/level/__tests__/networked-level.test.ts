import { NetworkedLevels, Level } from "../src";
import { levelMock, assetMock } from "./mocks";

const createNetworkedLevels = <T>(
  activateDistance = 0,
  loadDistance = 1,
  levelNum = 10
): {
  networkedLevel: NetworkedLevels<T>;
  levels: Level<T>[];
} => {
  const levels = new Array(levelNum).fill(0).map(() => levelMock<T>());
  const edges: [Level<T>, Level<T>][] = [];
  levels.reduce((prev, curr) => {
    edges.push([prev, curr]);
    return curr;
  });
  const level = new NetworkedLevels({
    initialLevel: levels[0],
    levels,
    edges,
    activateDistance,
    loadDistance,
  });
  return { networkedLevel: level, levels };
};

describe("@curtain-call/level.NetworkedLevel", () => {
  it("can load", async () => {
    const { networkedLevel, levels } = createNetworkedLevels(1, 2, 4);

    await networkedLevel.load();

    expect(levels[0].load).toBeCalled();
    expect(levels[1].load).toBeCalled();
    expect(levels[2].load).toBeCalled();
    expect(levels[3].load).not.toBeCalled();
  });

  it("can unload", async () => {
    const { networkedLevel, levels } = createNetworkedLevels(1, 2, 4);

    await networkedLevel.load();
    const exclude = new Set([assetMock()]);
    networkedLevel.unload(exclude);

    expect(levels[0].unload).toBeCalledWith(exclude);
    expect(levels[1].unload).toBeCalledWith(exclude);
    expect(levels[2].unload).toBeCalledWith(exclude);
    expect(levels[3].unload).toBeCalledWith(exclude);
  });

  it("can activate", async () => {
    const { networkedLevel, levels } = createNetworkedLevels(1, 2, 4);

    const scene = jest.fn();
    await networkedLevel.load();
    networkedLevel.activate(scene);

    expect(levels[0].activate).toBeCalledWith(scene);
    expect(levels[1].activate).toBeCalledWith(scene);
    expect(levels[2].activate).not.toBeCalled();
    expect(levels[3].activate).not.toBeCalled();
  });

  it("can deactivate", async () => {
    const { networkedLevel, levels } = createNetworkedLevels(1, 2, 4);

    const scene = jest.fn();
    await networkedLevel.load();
    networkedLevel.activate(scene);
    networkedLevel.deactivate(scene);

    expect(levels[0].deactivate).toBeCalledWith(scene);
    expect(levels[1].deactivate).toBeCalledWith(scene);
    expect(levels[2].deactivate).toBeCalledWith(scene);
    expect(levels[3].deactivate).toBeCalledWith(scene);
  });

  it("can move level", async () => {
    const { networkedLevel, levels } = createNetworkedLevels(0, 1, 4);

    const scene = jest.fn();
    await networkedLevel.load();
    networkedLevel.activate(scene);

    networkedLevel.moveTo(scene, levels[1]);

    expect(levels[0].deactivate).toBeCalledWith(scene);
    expect(levels[1].activate).toBeCalledWith(scene);
    expect(levels[2].activate).not.toBeCalled();
    expect(levels[3].activate).not.toBeCalled();

    expect(levels[0].unload).toBeCalled();
    expect(levels[1].load).toBeCalled();
    expect(levels[2].load).toBeCalled();
    expect(levels[3].load).not.toBeCalled();
  });

  it("can check can move", async () => {
    const { networkedLevel, levels } = createNetworkedLevels(0, 1, 4);

    levels[1].isLoaded = jest.fn().mockReturnValue(true);
    levels[1].isActive = jest.fn().mockReturnValue(true);
    expect(networkedLevel.canMoveTo(levels[1])).toBe(true);
  });

  it("can update with children", async () => {
    const { networkedLevel, levels } = createNetworkedLevels(0, 1, 4);

    const scene = jest.fn();
    const deltaSec = 0.125;
    networkedLevel.update(scene, deltaSec);

    levels.forEach((lv) => {
      expect(lv.update).toBeCalledWith(scene, deltaSec);
    });
  });
});
