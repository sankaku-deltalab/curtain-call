import { Matrix } from "trans-vector2d";
import { Transformation } from "@curtain-call/util";
import { Actor, DisplayObjects, Movers } from "../src";

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
});
