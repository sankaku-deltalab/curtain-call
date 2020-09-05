import { FiniteResource } from "../src";

describe("@curtain-call/util.FiniteResource", () => {
  it("is zero value and max at default", () => {
    const fr = new FiniteResource();

    expect(fr.value()).toBe(0);
    expect(fr.max()).toBe(0);
  });

  it.each`
    initial | max   | adding | afterValue | variation | maxed
    ${5}    | ${10} | ${2}   | ${7}       | ${2}      | ${false}
    ${10}   | ${10} | ${2}   | ${10}      | ${0}      | ${false}
    ${5}    | ${10} | ${7}   | ${10}      | ${5}      | ${true}
  `(
    "can add value",
    ({ initial, max, adding, afterValue, variation, maxed }) => {
      const fr = new FiniteResource().init(initial, max);

      const r = fr.add(adding);

      expect(r).toEqual({ variation, maxed });
      expect(fr.value()).toBe(afterValue);
    }
  );

  it.each`
    initial | max   | sub  | afterValue | variation | zeroed
    ${5}    | ${10} | ${2} | ${3}       | ${-2}     | ${false}
    ${0}    | ${10} | ${2} | ${0}       | ${0}      | ${false}
    ${5}    | ${10} | ${7} | ${0}       | ${-5}     | ${true}
  `("can sub value", ({ initial, max, sub, afterValue, variation, zeroed }) => {
    const fr = new FiniteResource().init(initial, max);

    const r = fr.sub(sub);

    expect(r).toEqual({ variation, zeroed });
    expect(fr.value()).toBe(afterValue);
  });
});
