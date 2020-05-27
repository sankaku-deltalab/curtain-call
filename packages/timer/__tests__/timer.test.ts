import { Timer } from "../src";

describe("@curtain-call/timer", () => {
  it("call callback when updated", () => {
    const callback = jest.fn();
    const timer = new Timer(false, 30, callback);

    const world = jest.fn();
    timer.update(world, 10);
    timer.update(world, 10);
    timer.update(world, 20);

    expect(callback).toBeCalledWith(world, 10);
    expect(timer.isActive()).toBe(false);
  });

  it("can loop", () => {
    const callback = jest.fn();
    const timer = new Timer(true, 30, callback);

    const world = jest.fn();
    timer.update(world, 70);

    expect(callback).toBeCalledWith(world, 40);
    expect(callback).toBeCalledWith(world, 10);
    expect(timer.isActive()).toBe(true);
  });

  it("can deactivate", () => {
    const callback = jest.fn();
    const timer = new Timer(false, 30, callback).deactivate();
    expect(timer.isActive()).toBe(false);

    const world = jest.fn();
    timer.update(world, 40);

    expect(callback).not.toBeCalled();
  });

  it("inactive Timer should remove from world", () => {
    const callback = jest.fn();
    const timer = new Timer(false, 30, callback).deactivate();

    expect(timer.isActive()).toBe(false);
    expect(timer.shouldRemoveSelfFromWorld()).toBe(true);
  });
});
