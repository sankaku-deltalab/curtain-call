import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { EngineWorldMappingImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-storage.EngineWorldMappingImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(EngineWorldMappingImpl);

    expect(impl).toBeInstanceOf(EngineWorldMappingImpl);
  });
});
