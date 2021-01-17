import { RandomGenerator } from "@curtain-call/entity";
import { WorldRandomUseCase, WorldRandomState } from "../../src";

const generatorMock = jest.fn<RandomGenerator, []>(() => ({
  randInt: jest.fn(),
  uniform: jest.fn(),
  choice: jest.fn(),
  createRandomGenerator: jest.fn(),
}));

describe("@curtain-call/uc-world.WorldRandomUseCase", () => {
  it("can set generator", () => {
    const state: WorldRandomState = {};
    const gen = new generatorMock();
    const uc = new WorldRandomUseCase();

    uc.setGeneratorFromEngine(state, gen);

    expect(state.generator).toBe(gen);
  });

  it("can get generator", () => {
    const gen = new generatorMock();
    const state: WorldRandomState = {
      generator: gen,
    };
    const uc = new WorldRandomUseCase();

    const r = uc.getGenerator(state);

    expect(r).toBe(gen);
  });

  it("can create generator", () => {
    const createdGen = new generatorMock();
    const gen = new generatorMock();
    gen.createRandomGenerator = jest.fn().mockReturnValue(createdGen);
    const state: WorldRandomState = {
      generator: gen,
    };
    const uc = new WorldRandomUseCase();

    const r = uc.createGenerator(state);

    expect(r).toBe(createdGen);
  });
});
