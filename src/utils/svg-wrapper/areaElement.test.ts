import { describe, expect, it } from "vitest";
import { findAreaIdFromTarget } from "./areaElement";

describe("findAreaIdFromTarget", () => {
  it("finds area ids through nested svg targets", () => {
    document.body.innerHTML = `
      <svg id="map">
        <g class="areas">
          <g data-area-id="nested"><g><path id="target" /></g></g>
        </g>
      </svg>
      <svg id="other"><g data-area-id="outside"><path id="skip" /></g></svg>
    `;
    const root = document.getElementById("map")!;

    expect(findAreaIdFromTarget(document.getElementById("target"), root)).toBe(
      "nested"
    );
    expect(
      findAreaIdFromTarget(document.getElementById("skip"), root)
    ).toBeNull();
    expect(findAreaIdFromTarget(null, root)).toBeNull();
  });
});
