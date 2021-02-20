import { injectable } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorIdGenerator } from "@curtain-call/uc-actor";

@injectable()
export class ActorIdGeneratorImpl implements ActorIdGenerator {
  create(): ActorId {
    return Symbol();
  }
}
