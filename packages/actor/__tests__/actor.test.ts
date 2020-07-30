import { Matrix, Vector } from "trans-vector2d";
import { BasicDamageDealer } from "@curtain-call/health";
import {
  Collision,
  RectCollisionShape,
  CollisionGroupPresets,
} from "@curtain-call/collision";
import { Actor } from "../src";
import { moverMock, spriteMock } from "./mock";
import { DisplayObject } from "@curtain-call/display-object";
import { Transformation, Team } from "@curtain-call/util";

describe("@curtain-call/actor.Actor", () => {
  describe("has transformation", () => {
    it("has global transform", () => {
      const actor = new Actor();

      expect(actor.getWorldTransform()).toEqual(Matrix.identity);
    });

    it("can move with local transform", () => {
      const newPos = { x: 1, y: 2 };
      const actor = new Actor().moveTo(newPos);

      expect(actor.getWorldTransform()).toEqual(Matrix.translation(newPos));
    });

    it("can rotate", () => {
      const newRot = 1;
      const actor = new Actor().rotateTo(newRot);

      expect(actor.getWorldTransform()).toEqual(Matrix.rotation(newRot));
    });

    it("can set local transform", () => {
      const newTrans = Matrix.from({
        translation: { x: 1, y: 2 },
        rotation: 3,
      });
      const actor = new Actor().setLocalTransform(newTrans);

      expect(actor.getWorldTransform()).toEqual(newTrans);
    });

    it("can attach to other actor", () => {
      const parentTrans = Matrix.from({
        translation: { x: 1, y: 2 },
        rotation: 3,
      });
      const parentActor = new Actor().setLocalTransform(parentTrans);
      const actor = new Actor().attachTo(parentActor);

      expect(actor.getWorldTransform()).toEqual(parentTrans);
    });

    it("can attach to other Transformation", () => {
      const parentTrans = Matrix.from({
        translation: { x: 1, y: 2 },
        rotation: 3,
      });
      const actor = new Actor().attachToTransformation(
        new Transformation().setLocal(parentTrans)
      );

      expect(actor.getWorldTransform()).toEqual(parentTrans);
    });

    it("can detach from other actor", () => {
      const parentTrans = Matrix.from({
        translation: { x: 1, y: 2 },
        rotation: 3,
      });
      const parentActor = new Actor().setLocalTransform(parentTrans);
      const actor = new Actor().attachTo(parentActor).detachFromParent();

      expect(actor.getWorldTransform()).toEqual(Matrix.identity);
    });

    it("can attach other transformation", () => {
      const childTrans = new Transformation();
      jest.spyOn(childTrans, "attachTo");

      const actorTrans = new Transformation();
      const _actor = new Actor({ trans: actorTrans }).attachTransformation(
        childTrans
      );

      expect(childTrans.attachTo).toBeCalledWith(actorTrans);
    });
  });

  describe("can use by world", () => {
    it("can be notified added to world and emit event", () => {
      const actor = new Actor();
      const ev = jest.fn();
      actor.event.on("addedToWorld", ev);

      const world = "world";
      actor.notifyAddedToWorld(world);

      expect(ev).toBeCalledWith(world);
    });

    it("can be notified removed from world and emit event", () => {
      const actor = new Actor();
      const ev = jest.fn();
      actor.event.on("removedFromWorld", ev);

      const world = "world";
      actor.notifyAddedToWorld(world);
      actor.notifyRemovedFromWorld(world);

      expect(ev).toBeCalledWith(world);
    });

    it("can express removing self from world", () => {
      const actor = new Actor().removeSelfFromWorld(true);

      const world = "world";
      expect(actor.shouldRemoveSelfFromWorld(world)).toBe(true);
    });

    it("can revoke removing self expressing", () => {
      const actor = new Actor()
        .removeSelfFromWorld(true)
        .removeSelfFromWorld(false);

      const world = "world";
      expect(actor.shouldRemoveSelfFromWorld(world)).toBe(false);
    });

    it("emit updated event", () => {
      const actor = new Actor();
      const ev = jest.fn();
      actor.event.on("updated", ev);

      const world = "world";
      const deltaSec = 123;
      actor.update(world, deltaSec);

      expect(ev).toBeCalledWith(world, deltaSec);
    });
  });

  describe("has single Collision", () => {
    it("can deal Collision", () => {
      const actor = new Actor()
        .removeSelfFromWorld(true)
        .removeSelfFromWorld(false);

      expect(actor.getCollision()).toBeInstanceOf(Collision);
    });

    it("can notify overlapping with other actor and emit event", () => {
      const actor = new Actor();
      const ev = jest.fn();
      actor.event.on("overlapped", ev);

      const world = "world";
      const otherActor = new Actor();
      actor.notifyOverlappedWith(world, new Set([otherActor]));

      expect(ev).toBeCalledWith(world, new Set([otherActor]));
    });

    it("can add shape", () => {
      const collisionShape = new RectCollisionShape().setSize(Vector.one);
      const actor = new Actor()
        .addCollisionShape(collisionShape)
        .moveTo(Vector.one);

      expect(actor.getCollision().getBox2Ds()).toStrictEqual([
        [0.5, 0.5, 1.5, 1.5],
      ]);
    });

    it("can remove shape", () => {
      const collisionShape = new RectCollisionShape().setSize(Vector.one);
      const actor = new Actor()
        .addCollisionShape(collisionShape)
        .removeCollisionShape(collisionShape);

      expect(actor.getCollision().getBox2Ds()).toStrictEqual([]);
    });

    it.each`
      isHuge
      ${true}
      ${false}
    `("can set collision as huge number", ({ isHuge }) => {
      const actor = new Actor().setCollisionAsHugeNumber(isHuge);

      expect(actor.getCollision().isHugeNumber()).toBe(isHuge);
    });

    it("can set collision group", () => {
      const actor = new Actor().setCollisionGroup(CollisionGroupPresets.player);

      expect(actor.getCollision().group()).toBe(CollisionGroupPresets.player);
    });

    it.each`
      enable
      ${true}
      ${false}
    `("can set collision enable", ({ enable }) => {
      const actor = new Actor().setCollisionEnable(enable);

      expect(actor.getCollision().isEnabled()).toBe(enable);
    });
  });

  describe("can use Mover", () => {
    it("can add Mover and use it when updated", () => {
      const movementDelta = new Vector(1, 2);
      const mover = moverMock(false, movementDelta);
      const actor = new Actor().addMover(mover);

      const world = "world";
      const deltaSec = 0.5;
      actor.update(world, deltaSec);

      expect(mover.update).toBeCalled();
      expect(actor.getWorldTransform()).toEqual(
        Matrix.translation(movementDelta.mlt(deltaSec))
      );
    });

    it("can remove Mover", () => {
      const movementDelta = new Vector(1, 2);
      const mover = moverMock(false, movementDelta);
      const actor = new Actor().addMover(mover).removeMover(mover);

      const world = "world";
      const deltaSec = 0.125;
      actor.update(world, deltaSec);

      expect(mover.update).not.toBeCalled();
    });
  });

  describe("can contain DisplayObjects", () => {
    it("can add DisplayObject", () => {
      const sprite = spriteMock();
      const actor = new Actor().addDisplayObject(sprite);

      const objects: DisplayObject[] = [];
      actor.iterateDisplayObject((obj) => objects.push(obj));
      expect(objects).toStrictEqual([sprite]);
    });

    it("can remove DisplayObject", () => {
      const sprite = spriteMock();
      const actor = new Actor()
        .addDisplayObject(sprite)
        .removeDisplayObject(sprite);

      const objects: DisplayObject[] = [];
      actor.iterateDisplayObject((obj) => objects.push(obj));
      expect(objects).toStrictEqual([]);
    });

    it("add DisplayObject was attached to actor trans", () => {
      const sprite = spriteMock();
      const actor = new Actor().addDisplayObject(sprite).moveTo({ x: 1, y: 2 });

      expect(sprite.trans.getGlobal()).toStrictEqual(actor.getWorldTransform());
    });

    it("update display objects in actor update", () => {
      const sprite = spriteMock();
      const actor = new Actor().addDisplayObject(sprite);

      const world = "world";
      const deltaSec = 125;
      actor.update(world, deltaSec);

      expect(sprite.updatePixiObject).toBeCalledWith(deltaSec);
    });
  });

  describe("has health", () => {
    it("is dead if not initialized", () => {
      const actor = new Actor();

      expect(actor.health()).toBe(0);
      expect(actor.healthMax()).toBe(0);
      expect(actor.isDead()).toBe(true);
    });

    it("can init health", () => {
      const actor = new Actor().initHealth(1, 2);

      expect(actor.health()).toBe(1);
      expect(actor.healthMax()).toBe(2);
      expect(actor.isDead()).toBe(false);
    });

    it("can take damage and emit event and notify it to DamageDealer", () => {
      const actor = new Actor().initHealth(1000, 2000);
      const ev = jest.fn();
      actor.event.on("takenDamage", ev);

      const world = "world";
      const damage = 125;
      const dealer = new BasicDamageDealer();
      jest.spyOn(dealer, "notifyDealtDamage");
      const damageType = { name: "test" };
      const r = actor.takeDamage(world, damage, dealer, damageType);

      expect(r.actualDamage).toBe(damage);
      expect(r.died).toBe(false);
      expect(actor.health()).toBe(1000 - damage);
      expect(dealer.notifyDealtDamage).toBeCalledWith(
        world,
        r.actualDamage,
        actor,
        damageType
      );
      expect(ev).toBeCalledWith(world, r.actualDamage, dealer, damageType);
    });

    it("can kill and emit event and notify it to DamageDealer", () => {
      const actor = new Actor().initHealth(1000, 2000);
      const ev = jest.fn();
      actor.event.on("dead", ev);

      const world = "world";
      const dealer = new BasicDamageDealer();
      jest.spyOn(dealer, "notifyKilled");
      const damageType = { name: "test" };
      actor.kill(world, dealer, damageType);

      expect(actor.health()).toBe(0);
      expect(actor.isDead()).toBe(true);
      expect(dealer.notifyKilled).toBeCalledWith(world, actor, damageType);
      expect(ev).toBeCalledWith(world, dealer, damageType);
    });

    it("remove self from world when died", () => {
      const actor = new Actor().initHealth(1, 1);
      jest.spyOn(actor, "removeSelfFromWorld");

      const world = "world";
      const damage = 1;
      const dealer = new BasicDamageDealer();
      const damageType = { name: "test" };
      actor.takeDamage(world, damage, dealer, damageType);

      expect(actor.removeSelfFromWorld).toBeCalledWith(true);
    });

    it("can heal", () => {
      const actor = new Actor().initHealth(1000, 2000);
      const ev = jest.fn();
      actor.event.on("beHealed", ev);

      const world = "world";
      const healAmount = 125;
      actor.heal(world, healAmount);

      expect(actor.health()).toBe(1000 + healAmount);
      expect(ev).toBeCalledWith(world, healAmount);
    });
  });

  describe("act as DamageDealer", () => {
    it("can be notified dealing damage", () => {
      const actor = new Actor();
      const ev = jest.fn();
      actor.event.on("dealDamage", ev);

      const parentDamageDealer = new BasicDamageDealer();
      jest.spyOn(parentDamageDealer, "notifyDealtDamage");
      actor.setDamageDealerParent(parentDamageDealer);

      const world = "world";
      const damage = 125;
      const taker = new Actor();
      const damageType = { name: "test" };
      actor.notifyDealtDamage(world, damage, taker, damageType);

      expect(ev).toBeCalledWith(world, damage, taker, damageType);
      expect(parentDamageDealer.notifyDealtDamage).toBeCalledWith(
        world,
        damage,
        taker,
        damageType
      );
    });

    it("can be notified killing", () => {
      const actor = new Actor();
      const ev = jest.fn();
      actor.event.on("killed", ev);

      const parentDamageDealer = new BasicDamageDealer();
      jest.spyOn(parentDamageDealer, "notifyKilled");
      actor.setDamageDealerParent(parentDamageDealer);

      const world = "world";
      const taker = new Actor();
      const damageType = { name: "test" };
      actor.notifyKilled(world, taker, damageType);

      expect(ev).toBeCalledWith(world, taker, damageType);
      expect(parentDamageDealer.notifyKilled).toBeCalledWith(
        world,
        taker,
        damageType
      );
    });
  });

  describe("join team", () => {
    it("initial team is noSide", () => {
      const actor = new Actor();

      expect(actor.getTeam()).toBe(Team.noSide);
    });

    it("can change team", () => {
      const actor = new Actor().setTeam(Team.playerSide);

      expect(actor.getTeam()).toBe(Team.playerSide);
    });
  });

  describe("can add sub-actors", () => {
    it("sub-actor could be removed after added", () => {
      const subActors = [new Actor(), new Actor()];
      const owner = new Actor().addSubActor(...subActors);

      subActors.forEach((sub) => {
        expect(() => owner.removeSubActor(sub)).not.toThrowError();
      });
    });

    it("sub-actor can not add to multiple owner and same owner", () => {
      const subActors = [new Actor(), new Actor()];

      const owner1 = new Actor().addSubActor(...subActors);
      const owner2 = new Actor();

      subActors.forEach((sub) => {
        expect(() => owner1.addSubActor(sub)).toThrowError();
        expect(() => owner2.addSubActor(sub)).toThrowError();
      });
    });

    it("sub-actor can tell owner", () => {
      const addedSubActor = new Actor();
      const owner = new Actor().addSubActor(addedSubActor);

      expect(addedSubActor.getOwnerActor()).toBe(owner);
    });

    it("owner can tell sub-actors", () => {
      const subActors = [new Actor(), new Actor()];

      const owner = new Actor()
        .addSubActor(subActors[0])
        .addSubActor(subActors[1]);

      expect(owner.getSubActors()).toEqual(subActors);
    });

    it("owner can check has sub-actor", () => {
      const addedSubActor = new Actor();
      const notAddedSubActor = new Actor();
      const owner = new Actor().addSubActor(addedSubActor);

      expect(owner.hasSubActor(addedSubActor)).toBe(true);
      expect(owner.hasSubActor(notAddedSubActor)).toBe(false);
    });

    it("sub-actor was attached to owner", () => {
      const subActors = [new Actor(), new Actor()];
      subActors.forEach((ac) => {
        jest.spyOn(ac, "attachTo");
      });

      const owner = new Actor().addSubActor(...subActors);

      subActors.forEach((sub) => {
        expect(sub.attachTo).toBeCalledWith(owner);
      });
    });

    it("sub-actor was detach from owner when removed", () => {
      const subActors = [new Actor(), new Actor()];

      const owner = new Actor().addSubActor(...subActors);

      subActors.forEach((ac) => {
        jest.spyOn(ac, "detachFromParent");
      });
      owner.removeSubActor(...subActors);

      subActors.forEach((sub) => {
        expect(sub.detachFromParent).toBeCalled();
      });
    });
  });
});
