import { worldMock, transMockClass, displayObjectMock } from "../mocks";
import {
  ActorWithDisplayObject,
  Transformation,
  DisplayObject,
} from "../../src";

export const createActorWithDisplayObject = (): {
  actor: ActorWithDisplayObject;
  trans: Transformation;
} => {
  const trans = new transMockClass();
  const actor = new ActorWithDisplayObject(trans);
  return { actor, trans };
};

describe("@curtain-call/actor.ActorWithDisplayObject", () => {
  it("can add DisplayObject", () => {
    const sprite = new displayObjectMock();
    const actor = createActorWithDisplayObject().actor.addDisplayObject(sprite);

    const objects: DisplayObject[] = [];
    actor.iterateDisplayObject((obj) => objects.push(obj));
    expect(objects).toStrictEqual([sprite]);
  });

  it("can remove DisplayObject", () => {
    const sprite = new displayObjectMock();
    const actor = createActorWithDisplayObject()
      .actor.addDisplayObject(sprite)
      .removeDisplayObject(sprite);

    const objects: DisplayObject[] = [];
    actor.iterateDisplayObject((obj) => objects.push(obj));
    expect(objects).toStrictEqual([]);
  });

  it("add DisplayObject was attached to actor trans", () => {
    const sprite = new displayObjectMock();
    const { actor, trans } = createActorWithDisplayObject();
    actor.addDisplayObject(sprite);

    expect(trans.attachChild).toBeCalledWith(sprite.trans, false);
  });

  it("update display objects in actor update", () => {
    const sprite = new displayObjectMock();
    const actor = createActorWithDisplayObject().actor.addDisplayObject(sprite);

    const world = new worldMock();
    const deltaSec = 125;
    actor.update(world, deltaSec);

    expect(sprite.update).toBeCalledWith(world, deltaSec);
  });

  it("can iterate display objects", () => {
    const sprite1 = new displayObjectMock();
    const sprite2 = new displayObjectMock();
    const actor = createActorWithDisplayObject()
      .actor.addDisplayObject(sprite1)
      .addDisplayObject(sprite2);

    const objects: DisplayObject[] = [];
    actor.iterateDisplayObject((d) => objects.push(d));

    expect(objects).toEqual([sprite1, sprite2]);
  });
});
