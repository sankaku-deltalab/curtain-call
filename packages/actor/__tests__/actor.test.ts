import { Matrix, Vector } from "trans-vector2d";
import { DisplayObject, Team } from "../src";
import {
  createActor,
  moverMockClass,
  worldMock,
  collisionShapeMock,
  displayObjectMock,
} from "./mocks";

describe("@curtain-call/actor.Actor", () => {
  describe("has transformation", () => {
    it("has global transform", () => {
      const actor = createActor().actor;

      expect(actor.getTransformation()).not.toBeUndefined();
    });

    it("can move with local transform", () => {
      const newPos = { x: 1, y: 2 };
      const { actor, trans } = createActor();
      const r = actor.moveTo(newPos);

      expect(r).toBe(actor);
      const expectedLocal = new Matrix(1, 0, -0, 1, 1, 2); // Like Matrix.translation(newPos)
      expect(trans.setLocal).toBeCalledWith(expectedLocal);
    });

    it("can rotate", () => {
      const newRot = 1;
      const { actor, trans } = createActor();
      const r = actor.rotateTo(newRot);

      expect(r).toBe(actor);
      expect(trans.setLocal).toBeCalledWith(Matrix.rotation(newRot));
    });

    it("can set local transform", () => {
      const newTrans = Matrix.from({
        translation: { x: 1, y: 2 },
        rotation: 3,
      });
      const { actor, trans } = createActor();
      const r = actor.setLocalTransform(newTrans);

      expect(r).toBe(actor);
      expect(trans.setLocal).toBeCalledWith(newTrans);
    });

    it("can swap local transform with function", () => {
      const oldTrans = Matrix.from({
        translation: { x: 4, y: 5 },
        rotation: 6,
      });
      const { actor, trans } = createActor();
      jest.spyOn(trans, "getLocal").mockReturnValue(oldTrans);

      const newTrans = Matrix.from({
        translation: { x: 1, y: 2 },
        rotation: 3,
      });
      const swapper = jest.fn().mockReturnValue(newTrans);
      const r = actor.swapLocalTransform(swapper);

      expect(r).toBe(actor);
      expect(trans.setLocal).toBeCalledWith(newTrans);
      expect(swapper).toBeCalledWith(oldTrans);
    });

    it("can attach other actor", () => {
      const parent = createActor();
      const child = createActor();
      parent.actor.attachActor(child.actor, false);

      expect(parent.trans.attachChild).toBeCalledWith(child.trans, false);
    });

    it("can attach other Transformation", () => {
      const parent = createActor();
      const child = createActor();
      parent.actor.attachTransformation(child.trans, false);

      expect(parent.trans.attachChild).toBeCalledWith(child.trans, false);
    });

    it("can detach other actor", () => {
      const parent = createActor();
      const child = createActor();
      parent.actor
        .attachActor(child.actor, false)
        .detachActor(child.actor, false);

      expect(parent.trans.detachChild).toBeCalledWith(child.trans, false);
    });

    it("can detach other transformation", () => {
      const parent = createActor();
      const child = createActor();
      parent.actor
        .attachTransformation(child.trans, false)
        .detachTransformation(child.trans, false);

      expect(parent.trans.detachChild).toBeCalledWith(child.trans, false);
    });
  });

  describe("can use in world", () => {
    it("can be notified added to world and emit event", () => {
      const actor = createActor().actor;
      const ev = jest.fn();
      actor.event.on("addedToWorld", ev);

      const world = new worldMock();
      actor.notifyAddedToWorld(world);

      expect(ev).toBeCalledWith(world);
    });

    it("can be notified removed from world and emit event", () => {
      const actor = createActor().actor;
      const ev = jest.fn();
      actor.event.on("removedFromWorld", ev);

      const world = new worldMock();
      actor.notifyAddedToWorld(world);
      actor.notifyRemovedFromWorld(world);

      expect(ev).toBeCalledWith(world);
    });

    it("can express removing self from world", () => {
      const actor = createActor().actor.reserveRemovingSelfFromWorld();

      const world = new worldMock();
      expect(actor.shouldRemoveSelfFromWorld(world)).toBe(true);
    });

    it("can revoke removing self expressing", () => {
      const actor = createActor()
        .actor.reserveRemovingSelfFromWorld()
        .cancelRemovingSelfFromWorld();

      const world = new worldMock();
      expect(actor.shouldRemoveSelfFromWorld(world)).toBe(false);
    });

    it("emit updated event", () => {
      const actor = createActor().actor;
      const ev = jest.fn();
      actor.event.on("updated", ev);

      const world = new worldMock();
      const deltaSec = 123;
      actor.update(world, deltaSec);

      expect(ev).toBeCalledWith(world, deltaSec);
    });

    it("can set life time", () => {
      const actor = createActor().actor;
      const world = new worldMock();

      const lifeTime = 123;
      actor.setLifeTime(lifeTime);
      expect(actor.shouldRemoveSelfFromWorld(world)).toBe(false);

      actor.update(world, lifeTime / 2);
      actor.update(world, lifeTime / 2);

      expect(actor.shouldRemoveSelfFromWorld(world)).toBe(true);
    });
  });

  describe("has single Collision", () => {
    it("has attached collision", () => {
      const { actor, trans, collision, collisionTrans } = createActor();

      expect(actor.getCollision()).toBe(collision);
      expect(trans.attachChild).toBeCalledWith(collisionTrans, false);
    });

    it("can notify overlapping with other actor and emit event", () => {
      const actor = createActor().actor;
      const ev = jest.fn();
      actor.event.on("overlapped", ev);

      const world = new worldMock();
      const otherActor = createActor().actor;
      actor.notifyOverlappedWith(world, new Set([otherActor]));

      expect(ev).toBeCalledWith(world, new Set([otherActor]));
    });

    it("can add shape", () => {
      const collisionShape = new collisionShapeMock();
      const actor = createActor().actor.addCollisionShape(collisionShape);

      expect(actor.getCollision().addShape).toBeCalledWith(collisionShape);
    });

    it("can remove shape", () => {
      const collisionShape = new collisionShapeMock();
      const actor = createActor()
        .actor.addCollisionShape(collisionShape)
        .removeCollisionShape(collisionShape);

      expect(actor.getCollision().removeShape).toBeCalledWith(collisionShape);
    });

    it.each`
      isHuge
      ${true}
      ${false}
    `("can set collision as huge number", ({ isHuge }) => {
      const { actor, collision } = createActor();
      actor.setCollisionAsHugeNumber(isHuge);

      expect(collision.setIsHugeNumber).toBeCalledWith(isHuge);
    });

    it("can set collision group", () => {
      const group = {
        category: 0,
        mask: 0,
      };
      const { actor, collision } = createActor();
      const r = actor.setCollisionGroup(group);

      expect(r).toBe(actor);
      expect(collision.setGroup).toBeCalledWith(group);
    });

    it.each`
      enable
      ${true}
      ${false}
    `("can set collision enable", ({ enable }) => {
      const { actor, collision } = createActor();
      actor.setCollisionEnable(enable);

      expect(collision.setEnable).toBeCalledWith(enable);
    });
  });

  describe("can use Mover", () => {
    it("can add Mover and use it when updated", () => {
      const movementDelta = new Vector(1, 2);
      const mover = new moverMockClass(false, movementDelta);
      const { actor, trans } = createActor();
      trans.getLocal = jest.fn().mockReturnValue(Matrix.identity);
      const r = actor.addMover(mover);

      const world = new worldMock();
      const deltaSec = 0.5;
      actor.update(world, deltaSec);

      expect(r).toBe(actor);
      expect(mover.update).toBeCalled();
      expect(trans.setLocal).toBeCalledWith(
        Matrix.translation(movementDelta.mlt(deltaSec))
      );
    });

    it("can remove Mover", () => {
      const movementDelta = new Vector(1, 2);
      const mover = new moverMockClass(false, movementDelta);
      const actor = createActor().actor.addMover(mover).removeMover(mover);

      const world = new worldMock();
      const deltaSec = 0.125;
      actor.update(world, deltaSec);

      expect(mover.update).not.toBeCalled();
    });
  });

  describe("can contain DisplayObjects", () => {
    it("can add DisplayObject", () => {
      const sprite = new displayObjectMock();
      const actor = createActor().actor.addDisplayObject(sprite);

      const objects: DisplayObject[] = [];
      actor.iterateDisplayObject((obj) => objects.push(obj));
      expect(objects).toStrictEqual([sprite]);
    });

    it("can remove DisplayObject", () => {
      const sprite = new displayObjectMock();
      const actor = createActor()
        .actor.addDisplayObject(sprite)
        .removeDisplayObject(sprite);

      const objects: DisplayObject[] = [];
      actor.iterateDisplayObject((obj) => objects.push(obj));
      expect(objects).toStrictEqual([]);
    });

    it("add DisplayObject was attached to actor trans", () => {
      const sprite = new displayObjectMock();
      const { actor, trans } = createActor();
      actor.addDisplayObject(sprite);

      expect(trans.attachChild).toBeCalledWith(sprite.trans, false);
    });

    it("do not update display objects in actor update", () => {
      const sprite = new displayObjectMock();
      const actor = createActor().actor.addDisplayObject(sprite);

      const world = new worldMock();
      const deltaSec = 125;
      actor.update(world, deltaSec);

      expect(sprite.notifyPreDraw).not.toBeCalled();
    });
  });

  describe("has health", () => {
    it("is initialized with 0 health in constructor", () => {
      const { health } = createActor();

      expect(health.init).toBeCalledWith(0, 0);
    });

    it("can init health", () => {
      const { actor, health } = createActor();
      actor.initHealth(1, 2);

      expect(health.init).toBeCalledWith(1, 2);
    });

    it("can take damage and emit event and notify it to DamageDealer", () => {
      const { actor, health } = createActor();
      const ev = jest.fn();
      actor.event.on("takenDamage", ev);

      const world = new worldMock();
      const damage = 125;
      const dealer = createActor().actor;
      jest.spyOn(dealer, "notifyDealtDamage");
      const damageType = { name: "test" };
      jest
        .spyOn(health, "sub")
        .mockReturnValue({ variation: -damage, zeroed: false });

      const r = actor.takeDamage(world, damage, dealer, damageType);

      expect(r.actualDamage).toBe(damage);
      expect(r.died).toBe(false);
      expect(dealer.notifyDealtDamage).toBeCalledWith(
        world,
        r.actualDamage,
        actor,
        damageType
      );
      expect(ev).toBeCalledWith(world, r.actualDamage, dealer, damageType);
    });

    it("can kill and emit event and notify it to DamageDealer", () => {
      const healthMax = 3;
      const { actor, health } = createActor();
      jest.spyOn(health, "max").mockReturnValue(healthMax);
      jest.spyOn(health, "value").mockReturnValue(1);
      const ev = jest.fn();
      actor.event.on("dead", ev);

      const world = new worldMock();
      const dealer = createActor().actor;
      jest.spyOn(dealer, "notifyKilled");
      const damageType = { name: "test" };
      actor.kill(world, dealer, damageType);
      jest.spyOn(health, "value").mockReturnValue(0);

      expect(health.init).lastCalledWith(0, healthMax);
      expect(actor.isDead()).toBe(true);
      expect(dealer.notifyKilled).toBeCalledWith(world, actor, damageType);
      expect(ev).toBeCalledWith(world, dealer, damageType);
    });

    it("remove self from world when died", () => {
      const { actor, health } = createActor();
      jest.spyOn(actor, "reserveRemovingSelfFromWorld");

      const world = new worldMock();
      const damage = 1;
      const dealer = createActor().actor;
      const damageType = { name: "test" };
      jest
        .spyOn(health, "sub")
        .mockReturnValue({ variation: -damage, zeroed: true });
      actor.takeDamage(world, damage, dealer, damageType);

      expect(actor.reserveRemovingSelfFromWorld).toBeCalled();
    });

    it("can heal", () => {
      const { actor, health } = createActor();
      const ev = jest.fn();
      actor.event.on("beHealed", ev);

      const world = new worldMock();
      const healAmount = 125;
      jest
        .spyOn(health, "add")
        .mockReturnValue({ variation: healAmount + 1, maxed: false });
      actor.heal(world, healAmount);

      expect(ev).toBeCalledWith(world, healAmount + 1);
    });
  });

  describe("join team", () => {
    it("initial team is noSide", () => {
      const actor = createActor().actor;

      expect(actor.getTeam()).toBe(Team.noSide);
    });

    it("can change team", () => {
      const actor = createActor().actor.setTeam(Team.playerSide);

      expect(actor.getTeam()).toBe(Team.playerSide);
    });
  });

  describe("can add sub-actors", () => {
    it("sub-actor could be removed after added", () => {
      const subActors = [createActor().actor, createActor().actor];
      const owner = createActor().actor.addSubActor(...subActors);

      subActors.forEach((sub) => {
        expect(() => owner.removeSubActor(sub)).not.toThrowError();
      });
    });

    it("sub-actor can not add to multiple owner and same owner", () => {
      const subActors = [createActor().actor, createActor().actor];

      const owner1 = createActor().actor.addSubActor(...subActors);
      const owner2 = createActor().actor;

      subActors.forEach((sub) => {
        expect(() => owner1.addSubActor(sub)).toThrowError();
        expect(() => owner2.addSubActor(sub)).toThrowError();
      });
    });

    it("sub-actor can tell owner", () => {
      const addedSubActor = createActor().actor;
      const owner = createActor().actor.addSubActor(addedSubActor);

      expect(addedSubActor.getOwnerActor()).toBe(owner);
    });

    it("owner can tell sub-actors", () => {
      const subActors = [createActor().actor, createActor().actor];

      const owner = createActor()
        .actor.addSubActor(subActors[0])
        .addSubActor(subActors[1]);

      expect(owner.getSubActors()).toEqual(subActors);
    });

    it("owner can check has sub-actor", () => {
      const addedSubActor = createActor().actor;
      const notAddedSubActor = createActor().actor;
      const owner = createActor().actor.addSubActor(addedSubActor);

      expect(owner.hasSubActor(addedSubActor)).toBe(true);
      expect(owner.hasSubActor(notAddedSubActor)).toBe(false);
    });

    it("sub-actor was attached to owner", () => {
      const subs = [createActor(), createActor()];

      const { actor, trans } = createActor();
      actor.addSubActor(...subs.map((s) => s.actor));

      subs.forEach((sub) => {
        expect(trans.attachChild).toBeCalledWith(sub.trans, false);
      });
    });

    it("sub-actor was detach from owner when removed", () => {
      const subs = [createActor(), createActor()];
      const subActors = subs.map((s) => s.actor);

      const { actor, trans } = createActor();
      actor.addSubActor(...subActors).removeSubActor(...subActors);

      subs.forEach((sub) => {
        expect(trans.detachChild).toBeCalledWith(sub.trans, true);
      });
    });
  });
});
