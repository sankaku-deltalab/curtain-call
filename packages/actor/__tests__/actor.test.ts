import { Matrix } from "trans-vector2d";
import { Transformation } from "@curtain-call/util";
import { Actor, DisplayObjects } from "../src";

describe("@curtain-call/actor", () => {
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
  });
});
