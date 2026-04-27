import { describe, it, expect, vi, beforeEach } from "vitest";
import { compareDegradation } from "./degradation";
import { apiUrl } from "./client";

const mockFetch = vi.fn();

describe("compareDegradation", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          original: { rg: 2.5, diff: 0.04, int_diff: 0.01, factor: 1.0 },
          v1_linear: { rg: 2.5, diff: 0.04, int_diff: 0.01, factor: 0.78 },
          v2_logarithmic: { rg: 2.5, diff: 0.04, int_diff: 0.01, factor: 0.85 },
          game_count: 50,
          coverstock_type: null,
          v2_lambda: 0.05,
        }),
    });
    vi.stubGlobal("fetch", mockFetch);
  });

  it("calls POST /degradation/compare with request body", async () => {
    const body = {
      rg: 2.5,
      diff: 0.04,
      int_diff: 0.01,
      coverstock_type: "Solid Reactive",
      game_count: 50,
    };
    await compareDegradation(body);
    expect(mockFetch).toHaveBeenCalledWith(
      apiUrl("/degradation/compare"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    );
  });

  it("returns response with original, v1_linear, v2_logarithmic results", async () => {
    const res = await compareDegradation({
      rg: 2.5,
      diff: 0.04,
      int_diff: 0.01,
      game_count: 50,
    });
    expect(res.original.factor).toBe(1.0);
    expect(res.v1_linear.factor).toBeLessThan(1.0);
    expect(res.v2_logarithmic.factor).toBeLessThan(1.0);
    expect(res.game_count).toBe(50);
  });

  it("supports lookup by ball_id", async () => {
    const body = { ball_id: "B1", game_count: 75 };
    await compareDegradation(body);
    const call = mockFetch.mock.calls[0];
    expect(JSON.parse(call[1].body)).toEqual(body);
  });
});
