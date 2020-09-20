import {
  World,
  FiniteResource,
  EventEmitter as IEventEmitter,
} from "../interface";
import { Actor, DamageType } from "../actor-interface";

export type ActorWithDamagingEvent = IEventEmitter<{
  takenDamage: [World, number, Actor, DamageType];
  dead: [World, Actor, DamageType];
  beHealed: [World, number];
  dealDamage: [World, number, Actor, DamageType];
  killed: [World, Actor, DamageType];
}>;

export class ActorWithDamaging {
  constructor(
    private readonly sharedEvent: ActorWithDamagingEvent,
    private readonly healthComponent: FiniteResource
  ) {
    this.healthComponent = this.healthComponent.init(0, 0);
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(): boolean {
    return this.isDead();
  }

  /**
   * Init health and healthMax.
   *
   * @param health Initial health.
   * @param health HealthMax.
   * @returns this.
   */
  initHealth(health: number, healthMax: number): this {
    this.healthComponent.init(health, healthMax);
    return this;
  }

  /**
   * Current health.
   *
   * @returns Current health.
   */
  health(): number {
    return this.healthComponent.value();
  }

  /**
   * Max health.
   *
   * @returns Max health.
   */
  healthMax(): number {
    return this.healthComponent.max();
  }

  /**
   * Return self is dead.
   *
   * @returns Self is dead.
   */
  isDead(): boolean {
    return this.healthComponent.value() === 0;
  }

  /**
   * Take damage to this.
   *
   * @param world World.
   * @param damage Damage amount.
   * @param dealer Damage dealer.
   * @param type Damage type.
   * @returns Damage taking result.
   */
  takeDamage(
    world: World,
    damage: number,
    dealer: Actor,
    type: DamageType
  ): { actualDamage: number; died: boolean } {
    const r = this.healthComponent.sub(damage);
    const actualDamage = -r.variation;
    const died = r.zeroed;

    this.sharedEvent.emit("takenDamage", world, actualDamage, dealer, type);
    if (died) {
      this.sharedEvent.emit("dead", world, dealer, type);
    }
    return { actualDamage, died };
  }

  /**
   * Kill self.
   *
   * @param world World.
   * @param dealer Death dealer.
   * @param type Damage type.
   */
  killSelf(world: World, dealer: Actor, type: DamageType): { died: boolean } {
    if (this.healthComponent.value() === 0) return { died: false };

    this.healthComponent.init(0, this.healthComponent.max());
    this.sharedEvent.emit("dead", world, dealer, type);
    return { died: true };
  }

  /**
   * Heal health.
   *
   * @param world World.
   * @param amount Healing amount.
   */
  heal(world: World, amount: number): { actualHealed: number } {
    const r = this.healthComponent.add(amount);
    this.sharedEvent.emit("beHealed", world, r.variation);
    return { actualHealed: r.variation };
  }

  /**
   * Deal damage to other actor.
   *
   * @param world Our world.
   * @param damage Dealing damage.
   * @param dealer Damage dealer.
   * @param taker Damaged actor.
   * @param type Damage type.
   */
  dealDamage(
    world: World,
    damage: number,
    dealer: Actor,
    taker: Actor,
    type: DamageType
  ): { actualDamage: number; killed: boolean } {
    const r = taker.takeDamage(world, damage, dealer, type);
    this.notifyDealtDamage(world, r.actualDamage, taker, type);
    if (r.died) this.notifyKilled(world, taker, type);
    return {
      actualDamage: r.actualDamage,
      killed: r.died,
    };
  }

  /**
   * Kill other actor.
   *
   * @param world Our world.
   * @param dealer Death dealer.
   * @param taker Damaged actor.
   * @param type Damage type.
   */
  killOther(
    world: World,
    dealer: Actor,
    taker: Actor,
    type: DamageType
  ): { killed: boolean } {
    const r = taker.killSelf(world, dealer, type);
    if (r.died) this.notifyKilled(world, taker, type);
    return {
      killed: r.died,
    };
  }

  /**
   * Notify this dealt damage to other.
   *
   * @param world Our world.
   * @param damage Dealt damage (not original damage).
   * @param taker Damaged Health.
   * @param type Damage type.
   */
  notifyDealtDamage(
    world: World,
    damage: number,
    taker: Actor,
    type: DamageType
  ): void {
    this.sharedEvent.emit("dealDamage", world, damage, taker, type);
  }

  /**
   * Notify this kill other.
   *
   * @param world Our world.
   * @param taker Damaged Actor.
   * @param type Damage type.
   */
  notifyKilled(world: World, taker: Actor, type: DamageType): void {
    this.sharedEvent.emit("killed", world, taker, type);
  }
}
