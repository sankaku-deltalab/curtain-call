import { ActorWithTimer, Timer } from "../../src";
import { worldMock } from "../mocks";

const timerMockClass = jest.fn<Timer, []>(() => ({
  isActive: jest.fn().mockReturnValue(true),
  deactivate: jest.fn().mockReturnThis(),
  update: jest.fn(),
}));

describe("@curtain-call/actor.ActorWithTimer", () => {
  it("can add timer and remove it", () => {
    const actor = new ActorWithTimer();

    const timer = new timerMockClass();

    expect(() => {
      actor.addTimer(timer);
      actor.removeTimer(timer);
    }).not.toThrowError();
  });

  it("update added timers", () => {
    const actor = new ActorWithTimer();

    const timer = new timerMockClass();
    actor.addTimer(timer);

    const world = new worldMock();
    const deltaSec = 0.125;
    actor.update(world, deltaSec);

    expect(timer.update).toBeCalledWith(world, deltaSec);
  });

  it("remove finished timers after updated", () => {
    const actor = new ActorWithTimer();

    const timer = new timerMockClass();
    jest.spyOn(timer, "isActive").mockReturnValue(false);
    actor.addTimer(timer);

    const world = new worldMock();
    const deltaSec = 0.125;
    actor.update(world, deltaSec);

    expect(timer.update).toBeCalledTimes(1);
    expect(timer.update).toBeCalledWith(world, deltaSec);

    actor.update(world, deltaSec);

    expect(timer.update).toBeCalledTimes(1);
  });
});
