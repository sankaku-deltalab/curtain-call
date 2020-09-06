import { NullLevel } from "../src";

describe("@curtain-call/level.NullLevel", () => {
  it("can load", async () => {
    const level = new NullLevel();

    expect(level.isLoaded()).toBe(false);

    await level.load();
    expect(level.isLoaded()).toBe(true);

    level.unload();
    expect(level.isLoaded()).toBe(false);
  });

  it("can activate", async () => {
    const level = new NullLevel();

    expect(level.isActive()).toBe(false);

    level.activate();
    expect(level.isActive()).toBe(true);

    level.deactivate();
    expect(level.isActive()).toBe(false);
  });
});
