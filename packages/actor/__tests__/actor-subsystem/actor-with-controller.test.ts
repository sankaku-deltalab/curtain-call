import { controllerMockClass, worldMock } from "../mocks";
import { ActorWithController } from "../../src";

describe("@curtain-call/actor.ActorWithController", () => {
  it("can set controller and can get controller", () => {
    const controller = new controllerMockClass();
    const actor = new ActorWithController();

    actor.setController(controller);

    expect(actor.getController()).toBe(controller);
  });

  it("update controller", () => {
    const controller = new controllerMockClass();
    const actor = new ActorWithController();
    actor.setController(controller);

    const world = new worldMock();
    const deltaSec = 0.125;
    actor.update(world, deltaSec);

    expect(controller.update).toBeCalledWith(world, deltaSec);
  });
});
