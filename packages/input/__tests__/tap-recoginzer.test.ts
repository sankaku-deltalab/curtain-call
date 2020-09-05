import { Vector } from "trans-vector2d";
import { TapRecognizer } from "../src/tap-recognizer";

describe("@curtain-call/input.TapRecognizer", () => {
  it("can tell single tapping", () => {
    const rec = new TapRecognizer();

    const downPos = new Vector(1, 2);
    const upPos = new Vector(3, 4);
    rec.down(downPos, 0);
    const r = rec.up(upPos, 10 / 60);

    expect(r).toEqual({ tapped: true, tapPositions: [downPos] });
  });

  it("do not tell tapping when press duration was too large", () => {
    const rec = new TapRecognizer().setPressDurationMax(0.5);
    const downPos = new Vector(1, 2);
    const upPos = new Vector(3, 4);
    rec.down(downPos, 0);
    const r = rec.up(upPos, 0.51);

    expect(r.tapped).toBe(false);
  });

  it("do not tell tapping when down and up position was too far ", () => {
    const rec = new TapRecognizer().setTapDistance(10);

    const downPos = new Vector(1, 2);
    const upPos = new Vector(1, 13);
    rec.down(downPos, 0);
    const r = rec.up(upPos, 5 / 60);

    expect(r.tapped).toBe(false);
  });

  it("can tell multiple tapping", () => {
    const rec = new TapRecognizer();

    const deltaSec = 5 / 60;
    const downPos1 = new Vector(1, 2);
    const upPos1 = new Vector(3, 4);
    const downPos2 = new Vector(5, 6);
    const upPos2 = new Vector(7, 8);
    rec.down(downPos1, deltaSec * 0);
    const r1 = rec.up(upPos1, deltaSec * 1);
    expect(r1).toEqual({ tapped: true, tapPositions: [downPos1] });

    rec.down(downPos2, deltaSec * 2);
    const r2 = rec.up(upPos2, deltaSec * 3);
    expect(r2).toEqual({ tapped: true, tapPositions: [downPos1, downPos2] });
  });

  it("do not tell multiple tapping when tapping duration was too large", () => {
    const rec = new TapRecognizer().setTapDuration(1);

    const deltaSec = 5 / 60;
    const downPos1 = new Vector(1, 2);
    const upPos1 = new Vector(3, 4);
    const downPos2 = new Vector(5, 6);
    const upPos2 = new Vector(7, 8);
    rec.down(downPos1, deltaSec * 0);
    const r1 = rec.up(upPos1, deltaSec * 1);
    rec.down(downPos2, deltaSec * 2 + 1);
    const r2 = rec.up(upPos2, deltaSec * 3 + 1);

    expect(r1).toEqual({ tapped: true, tapPositions: [downPos1] });
    expect(r2).toEqual({ tapped: true, tapPositions: [downPos2] });
  });
});
