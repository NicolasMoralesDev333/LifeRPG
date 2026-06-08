import { describe, expect, it } from "vitest";
import {
  buildThirtyDayActivity,
  calculateCurrentStreak,
  calculateLevelProgress,
  generateMockActivityLogs,
  getDateKey,
} from "./gameplay";

describe("calculateLevelProgress", () => {
  it("keeps progress below the level threshold", () => {
    expect(calculateLevelProgress(80, 100)).toEqual({
      nextXp: 80,
      nextNeeded: 100,
      levelsGained: 0,
    });
  });

  it("levels up once and carries overflow XP", () => {
    expect(calculateLevelProgress(120, 100)).toEqual({
      nextXp: 20,
      nextNeeded: 135,
      levelsGained: 1,
    });
  });

  it("supports multiple level ups in one reward burst", () => {
    expect(calculateLevelProgress(300, 100)).toEqual({
      nextXp: 65,
      nextNeeded: 183,
      levelsGained: 2,
    });
  });
});

describe("activity analytics", () => {
  it("builds a fixed thirty day activity window", () => {
    const today = new Date("2026-06-07T12:00:00.000Z");
    const activityDays = buildThirtyDayActivity(
      [
        {
          id: "one",
          date: "2026-06-06",
          type: "habit",
          label: "Programar",
          value: 2,
        },
        {
          id: "two",
          date: "2026-06-07",
          type: "boss",
          label: "Ataque final",
          value: 1,
        },
      ],
      today,
    );

    expect(activityDays).toHaveLength(30);
    expect(activityDays.at(0).date).toBe("2026-05-09");
    expect(activityDays.at(-2)).toMatchObject({
      date: "2026-06-06",
      count: 2,
    });
    expect(activityDays.at(-1)).toMatchObject({
      date: "2026-06-07",
      count: 1,
    });
  });

  it("calculates the current streak from the end of the window", () => {
    expect(
      calculateCurrentStreak([
        { date: "2026-06-04", count: 3 },
        { date: "2026-06-05", count: 0 },
        { date: "2026-06-06", count: 1 },
        { date: "2026-06-07", count: 2 },
      ]),
    ).toBe(2);
  });

  it("generates deterministic mock logs for the same seed and date", () => {
    const today = new Date("2026-06-07T12:00:00.000Z");
    const firstRun = generateMockActivityLogs("nicolas", today);
    const secondRun = generateMockActivityLogs("nicolas", today);

    expect(firstRun).toEqual(secondRun);
    expect(firstRun.every((log) => log.date <= getDateKey(today))).toBe(true);
  });
});
