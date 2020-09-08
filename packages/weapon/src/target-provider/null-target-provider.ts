import { TargetProvider } from "./target-provider";

export class NullTargetProvider implements TargetProvider {
  getTarget(): undefined {
    return undefined;
  }
}
