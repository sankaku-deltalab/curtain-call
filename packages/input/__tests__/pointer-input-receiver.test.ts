import { PointerInputReceiver } from "../src";
import { Vector } from "trans-vector2d";

describe("@curtain-call/input.PointerInputReceiver", () => {
  it("can spread event to children", () => {
    const recParent = new PointerInputReceiver();
    const recChild = new PointerInputReceiver();
    jest.spyOn(recChild.event, "emit");

    const convertedPoint = new Vector(1, 2);
    const converter = jest.fn().mockReturnValue(convertedPoint);
    recParent.addChild(recChild, converter);

    const eventPoint = new Vector(1, 2);
    recParent.event.emit("down", eventPoint);

    expect(converter).toBeCalledWith(eventPoint);
    expect(recChild.event.emit).toBeCalledWith("down", convertedPoint);
  });

  it("can remove children", () => {
    const recParent = new PointerInputReceiver();
    const recChild = new PointerInputReceiver();
    jest.spyOn(recChild.event, "emit");

    const convertedPoint = new Vector(1, 2);
    const converter = jest.fn().mockReturnValue(convertedPoint);
    recParent.addChild(recChild, converter);
    recParent.removeChild(recChild);

    const eventPoint = new Vector(1, 2);
    recParent.event.emit("down", eventPoint);

    expect(converter).not.toBeCalledWith(eventPoint);
    expect(recChild.event.emit).not.toBeCalledWith("down", convertedPoint);
  });
});
