import { DrawingObject } from "@curtain-call/entity";

export interface Renderer {
  render(objects: readonly DrawingObject[]): void;
}
