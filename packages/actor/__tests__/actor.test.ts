import { Matrix, Vector } from "trans-vector2d";
import { Transformation } from "@curtain-call/util";
import { DamageDealer } from "@curtain-call/health";
import { Collision, RectCollisionShape } from "@curtain-call/collision";
import { Actor, DisplayObjects, Movers } from "../src";
import { moverMock, spriteMock } from "./mock";
import { CollisionGroupPresets } from "@curtain-call/collision/src/collision-group";

describe("@curtain-call/actor.Actor", () => {
  describe("has DisplayObjects", () => {
    it("as property", () => {
      const actor = new Actor();

      expect(actor.displayObjects).toBeInstanceOf(DisplayObjects);
    });

    it("and trans was attached to actor", () => {
      const actor = new Actor<{}>();
      actor.trans.setLocal(Matrix.translation({ x: 1, y: 2 }));

      expect(actor.displayObjects.trans).toBeInstanceOf(Transformation);
    });

    it("and update them", () => {
      const actor = new Actor<{}>();
      jest.spyOn(actor.displayObjects, "update");

      const world = jest.fn();
      const deltaSec = 0.125;
      actor.update(world, deltaSec);

      expect(actor.displayObjects.update).toBeCalledWith(world, deltaSec);
    });
  });
  describe("has Movers", () => {
    it("as property", () => {
      const actor = new Actor();

      expect(actor.movers).toBeInstanceOf(Movers);
    });

    it("and update them", () => {
      const currentTrans = Matrix.translation({ x: 1, y: 2 });
      const newTrans = Matrix.translation({ x: 3, y: 4 });
      const actor = new Actor<{}>();
      actor.trans.setLocal(currentTrans);
      jest.spyOn(actor.movers, "update").mockReturnValue({
        done: false,
        newTrans,
      });

      const world = jest.fn();
      const deltaSec = 0.125;
      actor.update(world, deltaSec);

      expect(actor.movers.update).toBeCalledWith(world, deltaSec, currentTrans);
      expect(actor.trans.getLocal()).toEqual(newTrans);
    });
  });

  describe("can emit world event", () => {
    it("when added", () => {
      const func = jest.fn();
      const actor = new Actor();
      actor.event.on("addedToWorld", func);

      const world = jest.fn();
      actor.notifyAddedToWorld(world);

      expect(func).toBeCalledWith(world);
    });

    it("when removed", () => {
      const func = jest.fn();
      const actor = new Actor();
      actor.event.on("removedFromWorld", func);

      const world = jest.fn();
      actor.notifyRemovedFromWorld(world);

      expect(func).toBeCalledWith(world);
    });
  });

  it("should not remove from world when added to world", () => {
    const actor = new Actor();
    actor.removeSelfFromWorld();

    actor.notifyAddedToWorld({});

    expect(actor.shouldRemoveSelfFromWorld()).toBe(false);
  });

  it("has DamageDealer", () => {
    const actor = new Actor();

    expect(actor.damageDealer).toBeInstanceOf(DamageDealer);
  });

  it("has collision owned by self", () => {
    const collision = new Collision<unknown, Actor<unknown>>();
    jest.spyOn(collision, "attachTo");
    const actor = new Actor({ collision });

    expect(actor.collision).toBeInstanceOf(Collision);
    expect(actor.collision.owner()).toBe(actor);
    expect(actor.collision.attachTo).toBeCalledWith(actor.trans);
  });

  it("can move", () => {
    const actor = new Actor();
    actor.trans.setLocal(
      Matrix.from({
        translation: new Vector(1, 2),
        rotation: 3,
        scale: new Vector(4, 5),
      })
    );

    actor.moveTo({ x: 6, y: 7 });

    expect(
      actor.trans.getLocal().isClosedTo(
        Matrix.from({
          translation: new Vector(6, 7),
          rotation: 3,
          scale: new Vector(4, 5),
        })
      )
    ).toBe(true);
  });

  it("can rotate", () => {
    const actor = new Actor();
    actor.trans.setLocal(
      Matrix.from({
        translation: new Vector(1, 2),
        rotation: 3,
        scale: new Vector(4, 5),
      })
    );

    actor.rotateTo(6);

    expect(
      actor.trans.getLocal().isClosedTo(
        Matrix.from({
          translation: new Vector(1, 2),
          rotation: 6,
          scale: new Vector(4, 5),
        })
      )
    ).toBe(true);
  });

  it("can attach to other trans", () => {
    const actor = new Actor();
    jest.spyOn(actor.trans, "attachTo");

    const parent = new Transformation();
    actor.attachTo(parent);

    expect(actor.trans.attachTo).toBeCalledWith(parent);
  });

  it("can init health", () => {
    const actor = new Actor().healthInitialized(15);

    expect(actor.health.current()).toBe(15);
    expect(actor.health.max()).toBe(15);
  });

  it("can init health", () => {
    const actor = new Actor().healthInitialized(15);

    expect(actor.health.current()).toBe(15);
    expect(actor.health.max()).toBe(15);
  });

  it("can add mover", () => {
    const actor = new Actor();
    jest.spyOn(actor.movers, "add");

    const mover = moverMock(false, Vector.zero);
    actor.movedBy(mover);

    expect(actor.movers.add).toBeCalledWith(mover);
  });

  it("can add DisplayObject", () => {
    const actor = new Actor();
    jest.spyOn(actor.displayObjects, "add");

    const sprite = spriteMock();
    actor.visualizedBy(sprite);

    expect(actor.displayObjects.add).toBeCalledWith(sprite);
  });

  it("can add CollisionShape", () => {
    const actor = new Actor();
    jest.spyOn(actor.collision, "add");

    const collisionShape = new RectCollisionShape();
    actor.collideWith(collisionShape);

    expect(actor.collision.add).toBeCalledWith(collisionShape);
  });

  it("can set CollisionGroup", () => {
    const actor = new Actor();

    const group = CollisionGroupPresets.item;
    actor.setCollisionGroup(group);

    expect(actor.collision.group()).toBe(group);
  });

  it.each`
    enabled
    ${true}
    ${false}
  `("can set collision enable or disable", ({ enabled }) => {
    const actor = new Actor();

    actor.setCollisionEnabled(enabled);

    expect(actor.collision.isEnabled()).toBe(enabled);
  });
});
