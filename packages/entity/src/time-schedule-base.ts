import { WorldBase } from "./world-base";

export interface TimeScheduleBase {
  update(world: WorldBase, deltaSec: number): void;
  startFrom(time: number): void;
  abort(): void;
  stop(): void;
  resume(): void;
  currentTime(): number;
}
