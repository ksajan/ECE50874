import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSlotAssignments } from "./slots";
import { apiUrl } from "./client";

const mockFetch = vi.fn();

describe("getSlotAssignments", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          assignments: [],
          best_k: 0,
          silhouette_score: 0,
          slot_coverage: [],
        }),
    });
    vi.stubGlobal("fetch", mockFetch);
  });

  it("calls POST /slots with request body", async () => {
    const body = { arsenal_ball_ids: ["b1", "b2"] };
    await getSlotAssignments(body);
    expect(mockFetch).toHaveBeenCalledWith(
      apiUrl("/slots"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    );
  });

  it("returns response with assignments and slot_coverage", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          assignments: [
            {
              ball_id: "B1",
              name: "Test",
              brand: "Storm",
              slot: 1,
              slot_name: "Heavy Oil",
              slot_description: "Strong asym for heavy oil",
              rg: 2.48,
              diff: 0.055,
            },
          ],
          best_k: 1,
          silhouette_score: 0.42,
          slot_coverage: [
            { slot: 1, name: "Heavy Oil", covered: true },
            { slot: 2, name: "Med-Heavy", covered: false },
          ],
        }),
    });
    const res = await getSlotAssignments({ arsenal_ball_ids: ["B1"] });
    expect(res.assignments).toHaveLength(1);
    expect(res.assignments[0].slot).toBe(1);
    expect(res.best_k).toBe(1);
    expect(res.slot_coverage).toHaveLength(2);
  });

  it("passes game_counts when provided", async () => {
    const body = {
      arsenal_ball_ids: ["b1"],
      game_counts: { b1: 50 },
    };
    await getSlotAssignments(body);
    const call = mockFetch.mock.calls[0];
    expect(JSON.parse(call[1].body).game_counts).toEqual({ b1: 50 });
  });
});
