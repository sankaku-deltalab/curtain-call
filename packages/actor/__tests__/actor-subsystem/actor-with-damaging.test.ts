import { EventEmitter } from "eventemitter3";
import { actorInterfaceMockClass, worldMock, healthMockClass } from "../mocks";
import {
  Actor,
  FiniteResource,
  World,
  DamageType,
  ActorWithDamaging,
  ActorWithDamagingEvent,
} from "../../src";

export const createActorWithDamaging = (): {
  actor: ActorWithDamaging;
  event: ActorWithDamagingEvent;
  health: FiniteResource;
} => {
  const event = new EventEmitter<{
    takenDamage: [World, number, Actor, DamageType];
    dead: [World, Actor, DamageType];
    beHealed: [World, number];
    dealDamage: [World, number, Actor, DamageType];
    killed: [World, Actor, DamageType];
  }>();
  const health = new healthMockClass();
  const actor = new ActorWithDamaging(event, health);
  return { actor, event, health };
};

describe("@curtain-call/actor.ActorWithDamaging", () => {
  it("is initialized with 0 health in constructor", () => {
    const { health } = createActorWithDamaging();

    expect(health.init).toBeCalledWith(0, 0);
  });

  it("can init health", () => {
    const { actor, health } = createActorWithDamaging();
    actor.initHealth(1, 2);

    expect(health.init).toBeCalledWith(1, 2);
  });

  it.each`
    victimDied
    ${false}
    ${true}
    ${false}
  `("can take damage from other actor and emit event", ({ victimDied }) => {
    const {
      actor: taker,
      event: takerEvent,
      health,
    } = createActorWithDamaging();
    taker.initHealth(1000, 1000);
    const takeDamageEv = jest.fn();
    takerEvent.on("takenDamage", takeDamageEv);
    const deadEv = jest.fn();
    takerEvent.on("dead", deadEv);

    const dealer = new actorInterfaceMockClass();
    const damage = 125;
    const world = new worldMock();
    const damageType = { name: "test" };
    jest
      .spyOn(health, "sub")
      .mockReturnValue({ variation: -damage, zeroed: victimDied });
    const r = taker.takeDamage(world, damage, dealer, damageType);

    expect(r.actualDamage).toBe(damage);
    expect(r.died).toBe(victimDied);
    expect(takeDamageEv).toBeCalledWith(
      world,
      r.actualDamage,
      dealer,
      damageType
    );
    expect(health.sub).toBeCalledWith(damage);
    if (victimDied) {
      expect(deadEv).toBeCalledWith(world, dealer, damageType);
    } else {
      expect(deadEv).not.toBeCalled();
    }
  });

  it.each`
    victimDied
    ${false}
    ${true}
    ${false}
  `("can deal damage to other actor and emit event", ({ victimDied }) => {
    const { actor: dealer, event: dealerEvent } = createActorWithDamaging();
    const dealDamageEv = jest.fn();
    dealerEvent.on("dealDamage", dealDamageEv);
    const killedEv = jest.fn();
    dealerEvent.on("killed", killedEv);
    const dealerParent = new actorInterfaceMockClass();

    const damage = 125;
    const taker = new actorInterfaceMockClass();
    jest
      .spyOn(taker, "takeDamage")
      .mockReturnValue({ actualDamage: damage, died: victimDied });

    const world = new worldMock();
    const damageType = { name: "test" };
    const r = dealer.dealDamage(world, damage, dealerParent, taker, damageType);

    expect(r.actualDamage).toBe(damage);
    expect(r.killed).toBe(victimDied);
    expect(taker.takeDamage).toBeCalledWith(
      world,
      damage,
      dealerParent,
      damageType
    );
    expect(dealDamageEv).toBeCalledWith(
      world,
      r.actualDamage,
      taker,
      damageType
    );
    if (victimDied) {
      expect(killedEv).toBeCalledWith(world, taker, damageType);
    } else {
      expect(killedEv).not.toBeCalled();
    }
  });

  it("can kill self from other actor and emit event", () => {
    const {
      actor: taker,
      event: takerEvent,
      health,
    } = createActorWithDamaging();
    taker.initHealth(500, 1000);
    const deadEv = jest.fn();
    takerEvent.on("dead", deadEv);

    const dealer = new actorInterfaceMockClass();
    const world = new worldMock();
    const damageType = { name: "test" };
    jest.spyOn(health, "init");
    jest.spyOn(health, "max").mockReturnValue(1000);
    jest.spyOn(health, "value").mockReturnValue(500);
    const r = taker.killSelf(world, dealer, damageType);

    expect(r.died).toBe(true);
    expect(deadEv).toBeCalledWith(world, dealer, damageType);
    expect(health.init).toBeCalledWith(0, 1000);
  });

  it("can kill other actor and emit event", () => {
    const { actor: dealer, event: dealerEvent } = createActorWithDamaging();
    const killEv = jest.fn();
    dealerEvent.on("killed", killEv);
    const dealerParent = new actorInterfaceMockClass();

    const taker = new actorInterfaceMockClass();
    jest.spyOn(taker, "killSelf").mockReturnValue({ died: true });

    const world = new worldMock();
    const damageType = { name: "test" };
    const r = dealer.killOther(world, dealerParent, taker, damageType);

    expect(r.killed).toBe(true);
    expect(taker.killSelf).toBeCalledWith(world, dealerParent, damageType);
    expect(killEv).toBeCalledWith(world, taker, damageType);
  });

  it("should be removed self from world while dead", () => {
    const { actor } = createActorWithDamaging();
    jest.spyOn(actor, "isDead").mockReturnValue(true);

    expect(actor.shouldBeRemovedFromWorld()).toBe(true);
  });

  it("can heal", () => {
    const { actor, health, event } = createActorWithDamaging();
    const ev = jest.fn();
    event.on("beHealed", ev);

    const world = new worldMock();
    const healAmount = 125;
    jest
      .spyOn(health, "add")
      .mockReturnValue({ variation: healAmount + 1, maxed: false });
    actor.heal(world, healAmount);

    expect(ev).toBeCalledWith(world, healAmount + 1);
  });
});
