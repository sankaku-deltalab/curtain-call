import { VectorLike } from "trans-vector2d";
import { Actor as IActor } from "./actor-interface";

export interface Cleaner {
  onClean(fn: () => void): () => void;
  offClean(fn: () => void): void;
}

export type Easing = (v: number) => number;

export interface ActorManipulatorForTimer {
  /**
   * Wait time.
   *
   * @param cleaner
   * @param actor
   * @param timeSec
   */
  waitTime(cleaner: Cleaner, actor: IActor, timeSec: number): Promise<void>;
}

export interface ActorManipulatorForMovement {
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
  ): Promise<void>;

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
  ): Promise<void>;

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
  ): Promise<void>;

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
  ): Promise<void>;

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
  ): Promise<void>;
}

export interface ActorManipulatorForCollision {
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
  ): Promise<ReadonlySet<IActor>>;
}

export interface ActorManipulatorForPositionCheck {
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
  ): Promise<void>;

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
  ): Promise<void>;
}

export interface ActorManipulatorForWeapon {
  /**
   * Fire and wait finish firing.
   *
   * @param cleaner
   * @param actor
   */
  fireOnce(cleaner: Cleaner, actor: IActor): Promise<void>;

  /**
   * Wait finish firing.
   *
   * @param cleaner
   * @param actor
   */
  waitFinishFiring(cleaner: Cleaner, actor: IActor): Promise<void>;
}

export interface ActorManipulatorForHealth {
  /**
   * Wait actor dead.
   *
   * @param cleaner
   * @param actor
   */
  waitDead(cleaner: Cleaner, actor: IActor): Promise<void>;
}

export interface ActorManipulatorForWorld {
  /**
   * Wait actor was removed from world.
   *
   * @param cleaner
   * @param actor
   */
  waitRemovedFromWorld(cleaner: Cleaner, actor: IActor): Promise<void>;
}

export interface ActorManipulatorForMisc {
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
  ): Promise<void>;
}

export interface ActorManipulatorCleanerGenerator {
  /**
   * Create Cleaner for ActorManipulator.
   *
   * @returns Cleaner.
   */
  createCleaner(): Cleaner;
}
