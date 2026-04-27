import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRecommendationsV2 } from "./recommendations-v2";
import { apiUrl } from "./client";

const mockFetch = vi.fn();

describe("getRecommendationsV2", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          items: [],
          method: "knn",
          degradation_model: "v1",
          normalized: true,
        }),
    });
    vi.stubGlobal("fetch", mockFetch);
  });

  it("calls POST /recommendations/v2 with request body", async () => {
    const body = {
      arsenal_ball_ids: ["b1"],
      k: 5,
      method: "knn" as const,
      metric: "l2" as const,
      normalize: true,
      degradation_model: "v1" as const,
    };
    await getRecommendationsV2(body);
    expect(mockFetch).toHaveBeenCalledWith(
      apiUrl("/recommendations/v2"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    );
  });

  it("returns response with items, method, and degradation_model", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          items: [
            {
              ball: {
                ball_id: "B1",
                name: "Test",
                brand: "Storm",
                rg: 2.5,
                diff: 0.04,
                int_diff: 0.01,
                symmetry: null,
                coverstock_type: null,
                surface_grit: null,
                surface_finish: null,
                release_date: null,
                status: null,
              },
              score: 0.9,
              method: "knn",
            },
          ],
          method: "knn",
          degradation_model: "v1",
          normalized: true,
        }),
    });
    const res = await getRecommendationsV2({ arsenal_ball_ids: ["b1"], k: 1 });
    expect(res.items).toHaveLength(1);
    expect(res.items[0].ball.ball_id).toBe("B1");
    expect(res.items[0].score).toBe(0.9);
    expect(res.method).toBe("knn");
  });

  it("supports two_tower method", async () => {
    await getRecommendationsV2({
      arsenal_ball_ids: ["b1"],
      method: "two_tower",
    });
    const call = mockFetch.mock.calls[0];
    expect(JSON.parse(call[1].body).method).toBe("two_tower");
  });

  it("supports hybrid method", async () => {
    await getRecommendationsV2({
      arsenal_ball_ids: ["b1"],
      method: "hybrid",
    });
    const call = mockFetch.mock.calls[0];
    expect(JSON.parse(call[1].body).method).toBe("hybrid");
  });
});
