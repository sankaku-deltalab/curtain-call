import { IActor, Team, World, ActorRole } from "@curtain-call/actor";
import { TargetProvider } from "./target-provider";

/**
 * Provide nearest `Actor` joined given team.
 * Target was constantly provided while target is living.
 *
 * @example
 * const user = new Actor();
 * const tp = new NearestTargetProvider()
 *   .setTargetTeam(Team.enemySide)
 *   .setUser(user);
 */
export class NearestTargetProvider implements TargetProvider {
  private user?: IActor;
  private targeTeam?: Team;
  private currentTarget?: IActor;

  /**
   * Set user of self.
   *
   * @param user
   * @returns this.
   */
  setUser(user: IActor): this {
    this.user = user;
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
  getTarget(world: World): IActor | undefined {
    if (
      !this.user ||
      !this.currentTarget ||
      !this.targetIsTargetable(world, this.currentTarget)
    ) {
      this.currentTarget = this.searchTarget(world);
    }

    return this.currentTarget;
  }

  private targetIsTargetable(world: World, target: IActor): boolean {
    return (
      world.hasActor(target) &&
      !target.shouldRemoveSelfFromWorld(world) &&
      !target.isDead() &&
      target.getRole() === ActorRole.character &&
      target.getTeam() === this.targeTeam
    );
  }

  private searchTarget(world: World): IActor | undefined {
    if (!this.user) return undefined;

    const {
      translation: myPos,
    } = this.user.getTransformation().getGlobal().decompose();
    const actors = Array.from(world.iterateActors()).filter((ac) =>
      this.targetIsTargetable(world, ac)
    );

    const actorsWithDistance = actors.map<{ distance: number; actor?: IActor }>(
      (ac) => {
        const targetPos = ac.getTransformation().getGlobal().decompose()
          .translation;
        const distance = targetPos.distance(myPos);
        return { distance, actor: ac };
      }
    );

    const r = actorsWithDistance.reduce(
      (prev, curr) => (curr.distance < prev.distance ? curr : prev),
      {
        distance: Number.POSITIVE_INFINITY,
        actor: undefined,
      }
    );

    return r.actor;
  }
}
