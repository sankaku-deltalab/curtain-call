import { Actor } from "@curtain-call/actor";
import { DamageInterceptor } from "@curtain-call/health";
import { Weapon, NullWeapon } from "@curtain-call/weapon";
import { NullPlan } from "./null-plan";
import { Plan } from "./plan";
import { Team } from "../team";

class CharacterDamageInterceptor<T> implements DamageInterceptor<T> {
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
export class Character<T> extends Actor<T> {
  private team = Team.noSide;
  private weapon: Weapon<T> = new NullWeapon();
  private plan: Plan<T> = new NullPlan();
  private isImmortalInner = false;

  constructor() {
    super();
    this.health.addInterceptor(new CharacterDamageInterceptor(this));
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: T, deltaSec: number): void {
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
    this.team = team;
    return this;
  }

  /**
   * Get Team.
   *
   * @returns team.
   */
  getTeam(): Team {
    return this.team;
  }

  /**
   * Set Plan.
   *
   * @param plan New plan.
   * @returns this.
   */
  plannedBy(plan: Plan<T>): this {
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
   * Get owned weapon.
   *
   * @returns Weapon.
   */
  getWeapon(): Weapon<T> {
    return this.weapon;
  }

  /**
   * Set weapon.
   *
   * @param weapon New weapon.
   * @returns this.
   */
  armedWith(weapon: Weapon<T>): this {
    this.weapon = weapon;
    return this;
  }
}
