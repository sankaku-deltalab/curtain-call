import { Actor } from "../src";
import { Sprite } from "@curtain-call/display-object";

describe("@curtain-call/actor", () => {
  describe("can has DisplayObject", () => {
    it("and update them", () => {
      const obj = new Sprite();
      jest.spyOn(obj, "update");
      const actor = new Actor();
      jest.spyOn(actor, "displayObjects").mockReturnValue([obj]);

      const scene = jest.fn();
      const deltaSec = 0.125;
      actor.update(scene, deltaSec);

      expect(obj.update).toBeCalledWith(scene, deltaSec);
    });
  });
});
