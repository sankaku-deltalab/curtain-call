import { RandomGenerator } from "@curtain-call/entity";

export interface WorldRandomState {
  generator?: RandomGenerator;
}

export class WorldRandomUseCase {
  setGeneratorFromEngine(
    state: WorldRandomState,
    generator: RandomGenerator
  ): void {
    state.generator = generator;
  }

  getGenerator(state: WorldRandomState): RandomGenerator {
    if (!state.generator)
      throw new Error("Random generator was not set to World");
    return state.generator;
  }

  createGenerator(state: WorldRandomState): RandomGenerator {
    if (!state.generator)
      throw new Error("Random generator was not set to World");
    return state.generator.createRandomGenerator();
  }
}
