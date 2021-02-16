import { injectable } from "@curtain-call/shared-dependencies";
import { WorldId } from "@curtain-call/entity";
import { WorldIdGenerator } from "@curtain-call/uc-world";

@injectable()
export class WorldIdGeneratorImpl implements WorldIdGenerator {
  generate(): WorldId {
    return Symbol();
  }
}
