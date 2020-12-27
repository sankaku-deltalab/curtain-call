import {
  ActorManipulationCanceler,
  ActorManipulationCancelerFactory,
} from "../actor-manipulator-subsystems";

export class ActorManipulationCancelerImpl
  implements ActorManipulationCanceler {
  private readonly cancelCallbacks = new Set<() => void>();

  cancel(): void {
    this.cancelCallbacks.forEach((cb) => cb());
    this.cancelCallbacks.clear();
  }

  onCanceled(callback: () => void): void {
    this.cancelCallbacks.add(callback);
  }

  offCanceled(callback: () => void): void {
    this.cancelCallbacks.delete(callback);
  }
}

export class ActorManipulationCancelerFactoryImpl
  implements ActorManipulationCancelerFactory {
  /**
   * Create canceler.
   *
   * @returns New canceler.
   */
  createCanceler(): ActorManipulationCanceler {
    return new ActorManipulationCancelerImpl();
  }
}
