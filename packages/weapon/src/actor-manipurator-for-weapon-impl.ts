import { PredefinedPromise } from "predefined-promise";
import {
  World,
  ActorManipulatorForWeapon,
  ActorManipulationCanceler,
  Weapon,
} from "@curtain-call/actor";

export class ActorManipulatorForWeaponImpl
  implements ActorManipulatorForWeapon {
  /**
   * Fire and wait finish firing.
   *
   * @param canceler
   * @param weapon
   * @param world
   */
  fireOnce(
    canceler: ActorManipulationCanceler,
    weapon: Weapon,
    world: World
  ): Promise<void> {
    weapon.startFire(world);
    return this.waitFinishFiring(canceler, weapon, world);
  }

  /**
   * Wait finish firing.
   *
   * @param canceler
   * @param weapon
   * @param world
   */
  waitFinishFiring(
    canceler: ActorManipulationCanceler,
    weapon: Weapon,
    world: World
  ): Promise<void> {
    const pp = new PredefinedPromise<void>();

    const onUpdated = (): void => {
      if (weapon.isFiring()) return;
      pp.resolve();
    };

    const cancel = (): void => {
      pp.reject(new Error("Manipulation canceled"));
    };

    world.event.on("updated", onUpdated);
    canceler.onCanceled(cancel);
    return pp.wait().finally(() => {
      world.event.off("updated", onUpdated);
      canceler.offCanceled(cancel);
    });
  }
}
