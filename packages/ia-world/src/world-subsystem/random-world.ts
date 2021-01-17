import { RandomGenerator } from "@curtain-call/entity";
import { WorldRandomState, WorldRandomUseCase } from "@curtain-call/uc-world";

export class RandomWorld {
  private randomUseCase: WorldRandomUseCase;
  private state: WorldRandomState = {
    generator: undefined,
  };

  constructor(randomUseCase?: WorldRandomUseCase) {
    if (!randomUseCase) throw new Error("DI failed");
    this.randomUseCase = randomUseCase;
  }

  /**
   * Set random generator.
   *
   * @param generator
   */
  setRandomGenerator(generator: RandomGenerator): void {
    this.randomUseCase.setGeneratorFromEngine(this.state, generator);
  }

  /**
   * Get random generator.
   * Returned generator would be set by `setRandomGenerator`.
   *
   * @returns Random generator.
   */
  getRandomGenerator(): RandomGenerator {
    return this.randomUseCase.getGenerator(this.state);
  }

  /**
   * Create random generator.
   * When called this method, internal state of this would be changed.
   *
   * @returns New random generator.
   */
  createRandomGenerator(): RandomGenerator {
    return this.randomUseCase.createGenerator(this.state);
  }
}
