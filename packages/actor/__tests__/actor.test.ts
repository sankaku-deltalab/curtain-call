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

      const scene = jest.fn();
      const deltaSec = 0.125;
      actor.update(scene, deltaSec);

      expect(actor.displayObjects.update).toBeCalledWith(scene, deltaSec);
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

      const scene = jest.fn();
      const deltaSec = 0.125;
      actor.update(scene, deltaSec);

      expect(actor.movers.update).toBeCalledWith(scene, deltaSec, currentTrans);
      expect(actor.trans.getLocal()).toEqual(newTrans);
    });
  });

  describe("can emit scene event", () => {
    it("when added", () => {
      const func = jest.fn();
      const actor = new Actor();
      actor.event.on("addedToScene", func);

      const scene = jest.fn();
      actor.notifyAddedToScene(scene);

      expect(func).toBeCalledWith(scene);
    });

    it("when removed", () => {
      const func = jest.fn();
      const actor = new Actor();
      actor.event.on("removedFromScene", func);

      const scene = jest.fn();
      actor.notifyRemovedFromScene(scene);

      expect(func).toBeCalledWith(scene);
    });
  });
});
