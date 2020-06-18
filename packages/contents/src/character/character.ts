import * as gt from "guntree";
import { Actor, DisplayObjects, Movers } from "@curtain-call/actor";
import { DamageInterceptor, Health, DamageDealer } from "@curtain-call/health";
import {
  GuntreeWeapon,
  BulletGenerator,
  TargetProvider,
} from "@curtain-call/weapon";
import { World } from "@curtain-call/world";
import { Transformation } from "@curtain-call/util";
import { NullPlan } from "./null-plan";
import { Plan } from "./plan";
import { Team } from "../team";
import { Collision } from "@curtain-call/collision";

class CharacterDamageInterceptor<T extends World = World>
  implements DamageInterceptor<T> {
  constructor(private readonly character: Character<T>) {}
  /**
   * Take damage to self.
   *
   * @param world World.
   * @param damage Damage amount.
   * @returns Modified damage.
   */
  interceptDamage(world: T, damage: number): number {
    return this.character.isImmortal() ? 0 : damage;
  }
}

/**
 * Character.
 */
export class Character<TWorld extends World = World> extends Actor<TWorld> {
  /** Weapon. */
  public readonly weapon: GuntreeWeapon<TWorld, Actor<TWorld>>;

  private teamInner = Team.noSide;
  private plan: Plan<TWorld> = new NullPlan();
  private isImmortalInner = false;

  constructor(diArgs?: {
    trans?: Transformation;
    displayObjects?: DisplayObjects<TWorld>;
    movers?: Movers<TWorld>;
    health?: Health<TWorld>;
    damageDealer?: DamageDealer<TWorld>;
    collision?: Collision<TWorld, Actor<TWorld>>;
    weapon?: GuntreeWeapon<TWorld, Actor<TWorld>>;
  }) {
    super(diArgs);
    this.weapon = diArgs?.weapon || new GuntreeWeapon();

    this.health.addInterceptor(new CharacterDamageInterceptor(this));
    this.weapon.damageDealer.chainedFrom(this.damageDealer);
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: TWorld, deltaSec: number): void {
    super.update(world, deltaSec);
    this.plan.update(world, deltaSec, this);
    this.weapon.update(world, deltaSec);
  }

  /**
   * Set team.
   *
   * @param team New team.
   * @returns this.
   */
  inTeam(team: Team): this {
    this.teamInner = team;
    return this;
  }

  /**
   * Get Team.
   *
   * @returns team.
   */
  team(): Team {
    return this.teamInner;
  }

  /**
   * Set Plan.
   *
   * @param plan New plan.
   * @returns this.
   */
  plannedBy(plan: Plan<TWorld>): this {
    this.plan = plan;
    return this;
  }

  /**
   * Set immortality.
   *
   * @param immortality New immortality.
   * @returns this.
   */
  asImmortal(immortality: boolean): this {
    this.isImmortalInner = immortality;
    return this;
  }

  /**
   * Is immortal.
   *
   * @returns Is immortal.
   */
  isImmortal(): boolean {
    return this.isImmortalInner;
  }

  /**
   * Init weapon.
   *
   * @param args Arguments for firing.
   * @param args.guntree Using Guntree gun.
   * @param args.muzzles Muzzle transformations.
   * @param args.bulletGenerator Generator used when fired.
   * @param args.targetProvider Target provider.
   */
  initWeapon(args: {
    guntree: gt.Gun;
    muzzles: Map<string, Transformation>;
    bulletGenerator: BulletGenerator<TWorld, Actor<TWorld>>;
    targetProvider: TargetProvider<TWorld>;
  }): this {
    this.weapon.init(args);
    return this;
  }
}
