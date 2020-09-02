import { Collision } from "@curtain-call/actor";

export interface OverlapChecker {
  checkOverlap(collisions: Collision[]): Map<Collision, Set<Collision>>;
}
