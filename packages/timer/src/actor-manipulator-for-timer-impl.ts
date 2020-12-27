import { PredefinedPromise } from "predefined-promise";
import {
  IActor,
  ActorManipulatorForTimer,
  ActorManipulationCanceler,
} from "@curtain-call/actor";
import { Timer } from "./timer";

export class ActorManipulatorForTimerImpl implements ActorManipulatorForTimer {
  /**
   * Wait time.
   *
   * @param canceler
   * @param actor
   * @param timeSec
   */
  waitTime(
    canceler: ActorManipulationCanceler,
    actor: IActor,
    timeSec: number
  ): Promise<void> {
    const pp = new PredefinedPromise<void>();

    const timer = new Timer(false, timeSec, (): void => {
      pp.resolve(undefined);
    });
    actor.addTimer(timer);

    return pp.wait().catch(() => {
      actor.removeTimer(timer);
    });
  }
}
