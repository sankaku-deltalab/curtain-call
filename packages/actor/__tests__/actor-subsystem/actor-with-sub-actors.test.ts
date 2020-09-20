import { actorInterfaceMockClass, transMockClass } from "../mocks";
import { ActorWithSubActors, Transformation } from "../../src";

export const createActorWithSubActors = (): {
  actor: ActorWithSubActors;
  trans: Transformation;
} => {
  const trans = new transMockClass();
  const actor = new ActorWithSubActors(trans);
  return { actor, trans };
};

describe("@curtain-call/actor.ActorWithSubActors", () => {
  it("can add sub-actors", () => {
    const subActors = [
      new actorInterfaceMockClass(),
      new actorInterfaceMockClass(),
    ];
    const owner = createActorWithSubActors().actor.addSubActor(...subActors);

    subActors.forEach((sub) => {
      expect(() => owner.removeSubActor(sub)).not.toThrowError();
    });
  });

  it("can remove sub-actors", () => {
    const subActors = [
      new actorInterfaceMockClass(),
      new actorInterfaceMockClass(),
    ];
    const owner = createActorWithSubActors().actor.addSubActor(...subActors);

    subActors.forEach((sub) => {
      expect(() => owner.removeSubActor(sub)).not.toThrowError();
    });
  });

  it("can get sub-actors", () => {
    const subActors = [
      new actorInterfaceMockClass(),
      new actorInterfaceMockClass(),
    ];

    const owner = createActorWithSubActors()
      .actor.addSubActor(subActors[0])
      .addSubActor(subActors[1]);

    expect(owner.getSubActors()).toEqual(subActors);
  });

  it("sub-actor was attached to owner", () => {
    const subs = [new actorInterfaceMockClass(), new actorInterfaceMockClass()];

    const { actor, trans } = createActorWithSubActors();
    actor.addSubActor(...subs.map((s) => s));

    subs.forEach((sub) => {
      expect(trans.attachChild).toBeCalledWith(sub.getTransformation(), false);
    });
  });

  it("sub-actor was detach from owner when removed", () => {
    const subs = [new actorInterfaceMockClass(), new actorInterfaceMockClass()];
    const subActors = subs.map((s) => s);

    const { actor, trans } = createActorWithSubActors();
    actor.addSubActor(...subActors).removeSubActor(...subActors);

    subs.forEach((sub) => {
      expect(trans.detachChild).toBeCalledWith(sub.getTransformation(), true);
    });
  });
});
