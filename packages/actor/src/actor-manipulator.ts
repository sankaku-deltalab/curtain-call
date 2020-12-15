import { VectorLike } from "trans-vector2d";
import { autoInjectable, inject } from "tsyringe";
import { Actor as IActor } from "./actor-interface";
import {
  ActorManipulatorForTimer,
  ActorManipulatorForMovement,
  ActorManipulatorForCollision,
  ActorManipulatorForPositionCheck,
  ActorManipulatorForWeapon,
  ActorManipulatorForMisc,
  ActorManipulatorForWorld,
  ActorManipulatorForHealth,
  ActorManipulatorCleanerGenerator,
  Cleaner,
  Easing,
} from "./actor-manipulator-subsystems";

@autoInjectable()
export class ActorManipulator {
  constructor(
    @inject("ActorManipulatorForTimer")
    private readonly amForTimer: ActorManipulatorForTimer,
    @inject("ActorManipulatorForMovement")
    private readonly amForMovement: ActorManipulatorForMovement,
    @inject("ActorManipulatorForCollision")
    private readonly amForCollision: ActorManipulatorForCollision,
    @inject("ActorManipulatorForPositionCheck")
    private readonly amForPositionCheck: ActorManipulatorForPositionCheck,
    @inject("ActorManipulatorForWeapon")
    private readonly amForWeapon: ActorManipulatorForWeapon,
    @inject("ActorManipulatorForHealth")
    private readonly amForHealth: ActorManipulatorForHealth,
    @inject("ActorManipulatorForWorld")
    private readonly amForWorld: ActorManipulatorForWorld,
    @inject("ActorManipulatorForMisc")
    private readonly amForMisc: ActorManipulatorForMisc,
    @inject("ActorManipulatorCleanerGenerator")
    private readonly amCleanerGenerator: ActorManipulatorCleanerGenerator
  ) {}

  /**
   * Create Cleaner for ActorManipulator.
   *
   * @returns Cleaner.
   */
  createCleaner(): Cleaner {
    return this.amCleanerGenerator.createCleaner();
  }

  /**
   * Wait time.
   *
   * @param cleaner
   * @param actor
   * @param timeSec
   */
  waitTime(cleaner: Cleaner, actor: IActor, timeSec: number): Promise<void> {
    return this.amForTimer.waitTime(cleaner, actor, timeSec);
  }

  /**
   * Move actor and wait finish movement.
   *
   * Movement space is local of given actor.
   *
   * @param cleaner
   * @param actor
   * @param args
   */
  move(
    cleaner: Cleaner,
    actor: IActor,
    args:
      | {
          movement: VectorLike;
          easing: Easing;
          moveDurationSec: number;
        }
      | {
          movement: VectorLike;
          easing: Easing;
          averageSpeed: number;
        }
  ): Promise<void> {
    return this.amForMovement.move(cleaner, actor, args);
  }

  /**
   * Move actor and wait finish movement.
   *
   * Movement space is given actor transformation ({x: 1, y: 0} is front of actor).
   *
   * @param cleaner
   * @param actor
   * @param args
   */
  moveLocally(
    cleaner: Cleaner,
    actor: IActor,
    args:
      | {
          movement: VectorLike;
          easing: Easing;
          moveDurationSec: number;
        }
      | {
          movement: VectorLike;
          easing: Easing;
          averageSpeed: number;
        }
  ): Promise<void> {
    return this.amForMovement.moveLocally(cleaner, actor, args);
  }

  /**
   * Rotate actor and wait rotating.
   *
   * @param cleaner
   * @param actor
   * @param args
   */
  rotate(
    cleaner: Cleaner,
    actor: IActor,
    args:
      | {
          angleRad: number;
          easing: Easing;
          rotateDurationSec: number;
        }
      | {
          angleRad: number;
          easing: Easing;
          averageSpeed: number;
        }
  ): Promise<void> {
    return this.amForMovement.rotate(cleaner, actor, args);
  }

  /**
   * Rotate actor to given direction and wait rotating.
   *
   * @param cleaner
   * @param actor
   * @param args
   */
  rotateTo(
    cleaner: Cleaner,
    actor: IActor,
    args:
      | {
          angleRad: number;
          easing: Easing;
          rotateDurationSec: number;
        }
      | {
          angleRad: number;
          easing: Easing;
          averageSpeed: number;
        }
  ): Promise<void> {
    return this.amForMovement.rotateTo(cleaner, actor, args);
  }

  /**
   * Rotate actor to target and wait rotating.
   *
   * @param cleaner
   * @param actor
   * @param args
   */
  rotateToTarget(
    cleaner: Cleaner,
    actor: IActor,
    args:
      | {
          angleRad: number;
          easing: Easing;
          tolerance: number;
          rotateDurationSec: number;
        }
      | {
          angleRad: number;
          easing: Easing;
          tolerance: number;
          averageSpeed: number;
        }
  ): Promise<void> {
    return this.amForMovement.rotateToTarget(cleaner, actor, args);
  }

  /**
   * Wait actor overlap with filtered other actor.
   *
   * @param cleaner
   * @param actor
   * @param filter
   * @return Filtered overlapped actors.
   */
  waitOverlap(
    cleaner: Cleaner,
    actor: IActor,
    filter: (other: IActor) => boolean
  ): Promise<ReadonlySet<IActor>> {
    return this.amForCollision.waitOverlap(cleaner, actor, filter);
  }

  /**
   * Wait actor bounds is in given area.
   *
   * @param cleaner
   * @param actor
   * @param area
   */
  waitBoundsIsIn(
    cleaner: Cleaner,
    actor: IActor,
    area: [number, number, number, number]
  ): Promise<void> {
    return this.amForPositionCheck.waitBoundsIsIn(cleaner, actor, area);
  }

  /**
   * Wait actor position is in given area.
   *
   * @param cleaner
   * @param actor
   * @param area
   */
  waitPositionIsIn(
    cleaner: Cleaner,
    actor: IActor,
    area: [number, number, number, number]
  ): Promise<void> {
    return this.amForPositionCheck.waitPositionIsIn(cleaner, actor, area);
  }

  /**
   * Fire and wait finish firing.
   *
   * @param cleaner
   * @param actor
   */
  fireOnce(cleaner: Cleaner, actor: IActor): Promise<void> {
    return this.amForWeapon.fireOnce(cleaner, actor);
  }

  /**
   * Wait finish firing.
   *
   * @param cleaner
   * @param actor
   */
  waitFinishFiring(cleaner: Cleaner, actor: IActor): Promise<void> {
    return this.amForWeapon.waitFinishFiring(cleaner, actor);
  }

  /**
   * Wait actor dead.
   *
   * @param cleaner
   * @param actor
   */
  waitDead(cleaner: Cleaner, actor: IActor): Promise<void> {
    return this.amForHealth.waitDead(cleaner, actor);
  }

  /**
   * Wait actor was removed from world.
   *
   * @param cleaner
   * @param actor
   */
  waitRemovedFromWorld(cleaner: Cleaner, actor: IActor): Promise<void> {
    return this.amForWorld.waitRemovedFromWorld(cleaner, actor);
  }

  /**
   * Wait until is true.
   * Condition was checked when actor was updated.
   *
   * @param cleaner
   * @param actor
   * @param condition
   */
  waitUntil(
    cleaner: Cleaner,
    actor: IActor,
    condition: () => boolean
  ): Promise<void> {
    return this.amForMisc.waitUntil(cleaner, actor, condition);
  }
}
