import { Collision, CollisionModifyService } from "../../src";

describe("@curtain-call/CollisionModifyService", () => {
  it("init collision", () => {
    const service = new CollisionModifyService();
    const collision = new Collision();
    jest.spyOn(collision, "init");

    const initializingArgs = {
      shapes: [],
      group: {
        mask: 0,
        category: 0,
      },
      isExcess: false,
    };
    service.initCollision(collision, initializingArgs);

    expect(collision.init).toBeCalledWith(initializingArgs);
  });

  it("enable collision", () => {
    const service = new CollisionModifyService();
    const collision = new Collision();
    jest.spyOn(collision, "enable");

    service.enableCollision(collision);

    expect(collision.enable).toBeCalled();
  });

  it("disable collision", () => {
    const service = new CollisionModifyService();
    const collision = new Collision();
    jest.spyOn(collision, "disable");

    service.disableCollision(collision);

    expect(collision.disable).toBeCalled();
  });
});
