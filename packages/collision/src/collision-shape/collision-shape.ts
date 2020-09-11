import { Transformation } from "@curtain-call/actor";
import { Box2d } from "../common";

/**
 * CollisionShape deal collision boxes for overlap checking.
 */
export interface CollisionShape {
  /** Transformation. */
  trans: Transformation;

  /**
   * Get collision boxes for overlap checking.
   */
  getBox2Ds(): Box2d[];
}
