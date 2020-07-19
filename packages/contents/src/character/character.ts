import * as gt from "guntree";
import { Actor } from "@curtain-call/actor";
import { Health, DamageDealer, DamageType } from "@curtain-call/health";
import {
  GuntreeWeapon,
  BulletGenerator,
  TargetProvider,
} from "@curtain-call/weapon";
import { World } from "@curtain-call/world";
import { Transformation } from "@curtain-call/util";
import { NullPlan } from "./null-plan";
import { Plan } from "./plan";
import { Collision } from "@curtain-call/collision";

/**
 * Character.
 */
export class Character<TWorld extends World = World> extends Actor<TWorld> {
  /** Weapon. */
  public readonly weapon: GuntreeWeapon<TWorld, Actor<TWorld>>;

  private plan: Plan<TWorld> = new NullPlan();
  private isImmortalInner = false;

  constructor(diArgs?: {
    trans?: Transformation;
    health?: Health;
    collision?: Collision;
    weapon?: GuntreeWeapon<TWorld, Actor<TWorld>>;
  }) {
    super(diArgs);
    this.weapon = diArgs?.weapon || new GuntreeWeapon();

    this.weapon.damageDealer.setDamageDealerParent(this);
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
   * Notify added to world.
   * Called from only World.
   *
   * @param world Added World.
   */
  notifyAddedToWorld(world: TWorld): void {
    this.plan.start(world, this);
    super.notifyAddedToWorld(world);
  }

  /**
   * Take damage to this.
   *
   * @param world World.
   * @param damage Damage amount.
   * @param type Damage type.
   * @returns Damage taking result.
   */
  takeDamage(
    world: TWorld,
    damage: number,
    dealer: DamageDealer<TWorld, Actor<TWorld>>,
    type: DamageType
  ): { actualDamage: number; died: boolean } {
    const modifiedDamage = this.isImmortal() ? 0 : damage;
    return super.takeDamage(world, modifiedDamage, dealer, type);
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
