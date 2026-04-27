# Demo Walkthrough — Bowling Ball Grid Generator

**Total runtime:** ~4 minutes

## Setup

```bash
cd ECE50874
docker compose up --build
```

Wait for:
- Postgres ready on `:5432`
- Backend ready on `:8000` (`/health` returns 200)
- Frontend served on `:5173` (or `:80` via Caddy)

Open browser at http://localhost:5173.

---

## Scene 1 — Catalog (30s)

1. Click **Catalog** tab
2. Show "1,360 balls" counter
3. Type "storm" in search box → results filter live
4. Click a ball card (e.g., "Phaze IV")
5. Show ball detail: RG, differential, mass bias, coverstock, image
6. Click **Add to Bag**

**Talking points:** PostgreSQL backend, scraped from Bowling This Month, full text search, filters by brand/coverstock/symmetry.

---

## Scene 2 — Grid View + Voronoi gaps (60s)

1. Click **Grid View** tab
2. Show empty Voronoi map → "Add balls to see coverage"
3. Open arsenal panel, drag in 3-4 more balls (different RG/diff)
4. Watch Voronoi cells render in RG-Differential space
5. Point to large empty cells → "These are gaps in arsenal coverage"
6. Toggle **Slots** view → 6-ball slot system populated
7. Toggle **Recs** view → top recommendations to fill gaps
8. Switch **V1** ↔ **V2** to show degradation comparison
9. Switch **KNN** ↔ **Two-Tower** to show different recommendation methods

**Talking points:** Voronoi spatial partitioning, 6-ball slot framework (Storm/Motiv standard), weighted K-NN with coverstock encoding, two-tower neural embeddings for coverage-aware recs.

---

## Scene 3 — 3D Simulation (60s)

1. Click **3D Sim** tab
2. Show 3D bowling lane (Three.js + LatheGeometry pins, wood texture)
3. Select ball from arsenal
4. Adjust sliders: speed=17 mph, rev rate=300 rpm, angle=3°, board=15
5. Select oil pattern: "House (38ft)"
6. Click **Launch Ball**
7. Ball rolls down lane → hits pins → pin scatter (~4s total)
8. Show results panel: entry angle, breakpoint, skid/hook/roll lengths
9. Show decision framework advice (e.g., "Light pocket hit. Try board 18.")

**Talking points:** Rapier3D rigid-body physics, USBC-validated 4-part compound pin colliders, dual-state friction (oil μ=0.04, dry μ=0.2), 70 ms physics on main thread, decision framework feedback loop.

---

## Scene 4 — Vision Analysis (45s)

1. Click **Analysis** tab
2. Upload sample bowling video (or use stock clip)
3. Show MediaPipe BlazePose skeleton overlay during playback
4. Pause at release frame → show extracted speed and launch angle
5. Show form feedback (arm verticality, knee bend, balance)
6. Click **Simulate This Delivery** → handoff to 3D Sim with extracted params

**Talking points:** Client-side MediaPipe in Web Worker (privacy-preserving, no upload), kinematic extraction from wrist landmarks, hybrid suggestion interface (vision proposes, user adjusts), rev-rate as manual fallback per proposal risk plan.

---

## Scene 5 — Closing (15s)

Show GitHub PR #1 → 265 tests, all green CI (backend/frontend/E2E).
Show TECH_DEBT.md residual gaps documented honestly.

**Closing line:** "Browser-based bowling analytics, end-to-end, no install. 1,360-ball catalog, physics-validated 3D sim, recommendations grounded in USBC research. Built in a semester."

---

## Backup Talking Points

If asked about validation:
- Physics: 5-config validation matrix (Standard/Plastic/Cranker/Stroker/Hybrid all pass)
- Recommendation: 19 unit tests for KNN, 13 for slot assignment, 16 for two-tower
- Vision: rev-rate proxy not validated against ground truth — documented in Limitations

If asked about peer review:
- Group 14 reviewed Biweekly 5
- Three critiques: CI gap, doc drift, validation evidence
- All three addressed: E2E in CI, tense cleanup, explicit validation gap docs

If asked what we would do differently:
- Add E2E to CI from day 1
- Treat docs as part of feature definition of done
- Validate cross-component integration earlier
