import { Dispatch, SetStateAction } from "react";
import { describe, expect, it } from "vitest";
import { Seat } from "../types/api/socket";
import { applySeatSelections } from "./reservationSeatUpdates";

const seat = (id: string, selectedBy: string | null = null): Seat =>
  ({
    areaId: "area-a",
    cx: 1,
    cy: 1,
    id,
    number: 1,
    row: 1,
    selectedBy,
  }) as Seat;

const selection = (seatId: string, selectedBy: string | null) => ({
  expirationTime: "2026-06-03T00:00:00.000Z",
  seatId,
  selectedBy,
  updatedAt: "2026-06-03T00:00:00.000Z",
});

describe("applySeatSelections", () => {
  it("adds and updates seats selected by the current socket", () => {
    const selected = [seat("s1", "old"), seat("s0", "socket-a")];
    const setSelected = createSeatSetter(selected);
    const next = applySeatSelections(
      new Map([["s1", seat("s1")]]),
      [selection("s1", "socket-a")],
      "socket-a",
      setSelected
    );

    expect(next.get("s1")?.areaId).toBe("area-a");
    expect(selected[0].selectedBy).toBe("socket-a");
    expect(selected[1].id).toBe("s0");
  });

  it("removes released seats and ignores unknown seats", () => {
    const selected = [seat("s1", "socket-a")];
    const setSelected = createSeatSetter(selected);
    const next = applySeatSelections(
      new Map([["s1", seat("s1", "socket-a")]]),
      [selection("s1", null), selection("missing", "socket-a")],
      "socket-a",
      setSelected
    );

    expect(next.get("s1")?.selectedBy).toBeNull();
    expect(selected).toEqual([]);
  });

  it("adds new current-user selections and leaves other users alone", () => {
    const selected: Seat[] = [];
    const setSelected = createSeatSetter(selected);
    const next = applySeatSelections(
      new Map([
        ["s1", seat("s1")],
        ["s2", seat("s2")],
      ]),
      [selection("s1", "socket-a"), selection("s2", "socket-b")],
      "socket-a",
      setSelected
    );

    expect(next.get("s2")?.selectedBy).toBe("socket-b");
    expect(selected.map((item) => item.id)).toEqual(["s1"]);
  });
});

const createSeatSetter =
  (selected: Seat[]): Dispatch<SetStateAction<Seat[]>> =>
  (value) => {
    const next = typeof value === "function" ? value(selected) : value;
    selected.splice(0, selected.length, ...next);
  };
