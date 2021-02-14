import { injectable } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorDestroyingRequester } from "@curtain-call/uc-world";

@injectable()
export class ActorDestroyingRequesterImpl implements ActorDestroyingRequester {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  requestDestroy(actor: ActorId): void {
    throw new Error("not implemented");
  }
}
