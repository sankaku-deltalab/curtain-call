import { Matrix, Vector } from "trans-vector2d";
import {
  actorInterfaceMockClass,
  moverMockClass,
  worldMock,
  transMockClass,
} from "../mocks";
import { Transformation, ActorWithTransformation } from "../../src";

export const createActorWithDamaging = (): {
  actor: ActorWithTransformation;
  trans: Transformation;
} => {
  const trans = new transMockClass();
  const actor = new ActorWithTransformation(trans);
  return { actor, trans };
};

describe("@curtain-call/actor.ActorWithTransformation", () => {
  it("has global transform", () => {
    const actor = createActorWithDamaging().actor;

    expect(actor.getTransformation()).not.toBeUndefined();
  });

  it("can move with local transform", () => {
    const newPos = { x: 1, y: 2 };
    const { actor, trans } = createActorWithDamaging();
    const r = actor.moveTo(newPos);

    expect(r).toBe(actor);
    const expectedLocal = new Matrix(1, 0, -0, 1, 1, 2); // Like Matrix.translation(newPos)
    expect(trans.setLocal).toBeCalledWith(expectedLocal);
  });

  it("can rotate", () => {
    const newRot = 1;
    const { actor, trans } = createActorWithDamaging();
    const r = actor.rotateTo(newRot);

    expect(r).toBe(actor);
    expect(trans.setLocal).toBeCalledWith(Matrix.rotation(newRot));
  });

  it("can set local transform", () => {
    const newTrans = Matrix.from({
      translation: { x: 1, y: 2 },
      rotation: 3,
    });
    const { actor, trans } = createActorWithDamaging();
    const r = actor.setLocalTransform(newTrans);

    expect(r).toBe(actor);
    expect(trans.setLocal).toBeCalledWith(newTrans);
  });

  it("can swap local transform with function", () => {
    const oldTrans = Matrix.from({
      translation: { x: 4, y: 5 },
      rotation: 6,
    });
    const { actor, trans } = createActorWithDamaging();
    jest.spyOn(trans, "getLocal").mockReturnValue(oldTrans);

    const newTrans = Matrix.from({
      translation: { x: 1, y: 2 },
      rotation: 3,
    });
    const swapper = jest.fn().mockReturnValue(newTrans);
    const r = actor.swapLocalTransform(swapper);

    expect(r).toBe(actor);
    expect(trans.setLocal).toBeCalledWith(newTrans);
    expect(swapper).toBeCalledWith(oldTrans);
  });

  it("can attach other actor", () => {
    const parent = createActorWithDamaging();
    const child = new actorInterfaceMockClass();
    parent.actor.attachActor(child, false);

    expect(parent.trans.attachChild).toBeCalledWith(
      child.getTransformation(),
      false
    );
  });

  it("can attach other Transformation", () => {
    const parent = createActorWithDamaging();
    const childTrans = new transMockClass();
    parent.actor.attachTransformation(childTrans, false);

    expect(parent.trans.attachChild).toBeCalledWith(childTrans, false);
  });

  it("can detach other actor", () => {
    const parent = createActorWithDamaging();
    const child = new actorInterfaceMockClass();
    parent.actor.attachActor(child, false).detachActor(child, false);

    expect(parent.trans.detachChild).toBeCalledWith(
      child.getTransformation(),
      false
    );
  });

  it("can detach other transformation", () => {
    const parent = createActorWithDamaging();
    const child = createActorWithDamaging();
    parent.actor
      .attachTransformation(child.trans, false)
      .detachTransformation(child.trans, false);

    expect(parent.trans.detachChild).toBeCalledWith(child.trans, false);
  });

  it("can add Mover and use it when updated", () => {
    const movementDelta = new Vector(1, 2);
    const mover = new moverMockClass(false, movementDelta);
    const { actor, trans } = createActorWithDamaging();
    trans.getLocal = jest.fn().mockReturnValue(Matrix.identity);
    const r = actor.addMover(mover);

    const world = new worldMock();
    const deltaSec = 0.5;
    actor.update(world, deltaSec);

    expect(r).toBe(actor);
    expect(mover.update).toBeCalled();
    expect(trans.setLocal).toBeCalledWith(
      Matrix.translation(movementDelta.mlt(deltaSec))
    );
  });

  it("can remove Mover", () => {
    const movementDelta = new Vector(1, 2);
    const mover = new moverMockClass(false, movementDelta);
    const actor = createActorWithDamaging()
      .actor.addMover(mover)
      .removeMover(mover);

    const world = new worldMock();
    const deltaSec = 0.125;
    actor.update(world, deltaSec);

    expect(mover.update).not.toBeCalled();
  });
});
