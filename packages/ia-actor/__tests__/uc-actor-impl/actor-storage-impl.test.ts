import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorStorageImpl } from "../../src";

describe("@curtain-call/ia-actor.ActorStorageImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();

    const impl = subContainer.resolve(ActorStorageImpl);

    expect(impl).toBeInstanceOf(ActorStorageImpl);
  });
});
