import { Collision, CollisionModifyServiceImpl } from "../../src";

export const collisionMockClass = jest.fn<Collision, [Partial<Collision>]>(
  (option: Partial<Collision>) =>
    Object.assign(
      {
        init: jest.fn(),
        calcCollisionStatus: jest.fn(),
        enable: jest.fn(),
        disable: jest.fn(),
      },
      option
    )
);

describe("@curtain-call/CollisionModifyService", () => {
  it("init collision", () => {
    const service = new CollisionModifyServiceImpl();
    const collision = new collisionMockClass({});

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
    const service = new CollisionModifyServiceImpl();
    const collision = new collisionMockClass({});

    service.enableCollision(collision);

    expect(collision.enable).toBeCalled();
  });

  it("disable collision", () => {
    const service = new CollisionModifyServiceImpl();
    const collision = new collisionMockClass({});

    service.disableCollision(collision);

    expect(collision.disable).toBeCalled();
  });
});
