import { sequentialLevelNetwork } from "../src";
import { levelMockClass } from "./mocks";

describe("@curtain-call/level.sequentialLevelNetwork", () => {
  it("create network", async () => {
    const levelNum = 3;
    const levels = new Array(levelNum).fill(0).map(() => new levelMockClass());

    const activateDistance = 0;
    const loadDistance = 1;
    const network = sequentialLevelNetwork(
      activateDistance,
      loadDistance,
      levels
    );

    expect(network.levels).toEqual(levels);
    expect(network.initialLevel).toBe(levels[0]);
    expect(network.activateDistance).toBe(activateDistance);
    expect(network.loadDistance).toBe(loadDistance);
    expect(network.edges).toEqual([
      [levels[0], levels[1]],
      [levels[1], levels[2]],
    ]);
  });
});
