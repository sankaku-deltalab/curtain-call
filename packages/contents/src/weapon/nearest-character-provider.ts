import { TargetProvider } from "@curtain-call/weapon";
import { World } from "@curtain-call/world";
import { Transformation } from "@curtain-call/util";
import { Team } from "../team";
import { Character } from "../character/character";

/**
 * Provide nearest `Character` joined given team.
 * Target was constantly provided while target is living.
 */
export class NearestCharacterProvider<TWorld extends World = World>
  implements TargetProvider<TWorld> {
  public readonly trans = new Transformation();
  private targeTeam?: Team;
  private currentTarget?: Character<TWorld>;

  /**
   * Set targetable enemy's team.
   *
   * @param team Targetable team.
   * @returns this.
   */
  attachTo(transform: Transformation): this {
    this.trans.attachTo(transform);
    return this;
  }

  /**
   * Set targetable enemy's team.
   *
   * @param team Targetable team.
   * @returns this.
   */
  setTargetTeam(team: Team): this {
    this.targeTeam = team;
    return this;
  }

  /**
   * Get target transformation.
   *
   * @param world Our world.
   * @returns Target transformation.
   */
  getTargetTrans(world: TWorld): Transformation | undefined {
    if (!this.currentTarget || !this.targetIsAlive(world, this.currentTarget)) {
      this.currentTarget = this.searchTarget(world);
    }

    if (!this.currentTarget) return undefined;
    return this.currentTarget.trans;
  }

  private targetIsAlive(world: TWorld, target: Character<TWorld>): boolean {
    return (
      world.hasActor(target) &&
      !target.shouldRemoveSelfFromWorld() &&
      !target.health.isDead()
    );
  }

  private searchTarget(world: TWorld): Character<TWorld> | undefined {
    const actors = Array.from(world.iterateActors());
    let target: Character<TWorld> | undefined = undefined;
    let targetDistance = Number.POSITIVE_INFINITY;

    const { translation: myPos } = this.trans.getGlobal().decompose();
    for (const ac of actors) {
      if (!(ac instanceof Character)) continue;
      if (!this.targetIsAlive(world, ac)) continue;
      if (ac.team() !== this.targeTeam) continue;

      const { translation: targetPos } = ac.trans.getGlobal().decompose();
      const distance = targetPos.distance(myPos);
      if (!target || (target && distance < targetDistance)) {
        target = ac;
        targetDistance = distance;
      }
    }

    return target;
  }
}
