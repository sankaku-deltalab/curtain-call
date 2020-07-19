import { World } from "@curtain-call/world";
import { Character } from "./character";
import { Plan } from "./plan";
import { PositionStatusWithArea } from "@curtain-call/util";

enum EnemyState {
  notEnteredYet = "notEnteredYet",
  entered = "entered",
  exited = "exited",
}

/**
 * 1. When character was entered to core and visible area, start fire.
 * 2. When character was exit from core and visible area, remove self.
 */
export class SimpleEnemyPlan<TWorld extends World> implements Plan<TWorld> {
  private state = EnemyState.notEnteredYet;

  /**
   * Start this plan.
   */
  start(): void {
    this.state = EnemyState.notEnteredYet;
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   * @param character Target character.
   */
  update(world: TWorld, deltaSec: number, character: Character<TWorld>): void {
    const characterAreaStatus = this.calcCharacterPositionStatus(
      world,
      character
    );
    if (this.state === EnemyState.notEnteredYet) {
      if (characterAreaStatus === PositionStatusWithArea.inArea) {
        this.state = EnemyState.entered;
        character.weapon.start(world);
      }
    } else if (this.state === EnemyState.entered) {
      if (
        characterAreaStatus === PositionStatusWithArea.onAreaEdge ||
        characterAreaStatus === PositionStatusWithArea.outOfArea
      ) {
        this.state = EnemyState.exited;
        character.weapon.stop();
        character.removeSelfFromWorld(true);
      }
    }
  }

  private calcCharacterPositionStatus(
    world: TWorld,
    character: Character<TWorld>
  ): PositionStatusWithArea {
    const { translation } = character.getWorldTransform().decompose();
    const coreStatus = world.calcPositionStatusWithCoreArea(translation, 0);
    const visualStatus = world.camera.calcVisibilityStatus(translation, 0);
    if (
      coreStatus === PositionStatusWithArea.inArea &&
      visualStatus === PositionStatusWithArea.inArea
    ) {
      return PositionStatusWithArea.inArea;
    } else if (
      coreStatus === PositionStatusWithArea.outOfArea ||
      visualStatus === PositionStatusWithArea.outOfArea
    ) {
      return PositionStatusWithArea.outOfArea;
    }
    return PositionStatusWithArea.onAreaEdge;
  }
}
