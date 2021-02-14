import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorToWorldMappingImpl } from "../../src";

describe("@curtain-call/ia-world.ActorToWorldMappingImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();

    const impl = subContainer.resolve(ActorToWorldMappingImpl);

    expect(impl).toBeInstanceOf(ActorToWorldMappingImpl);
  });
});
