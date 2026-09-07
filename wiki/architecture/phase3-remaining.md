# Phase 3 remaining

Living list for LLM/ML intelligence. Product thesis stays in [product-plan.md](../references/product-plan.md). Impl history stays in [implementation-phases.md](implementation-phases.md) (last numbered Impl is 95).

Phase 1 leftover key-swap (A–D, including leftover B) stays in [phase1-integration-remaining.md](phase1-integration-remaining.md). Team and cloud stays in [phase2-remaining.md](phase2-remaining.md). Prep modules stay in [prep-modules-remaining.md](prep-modules-remaining.md).

Phase 3 is **not done**. Do not start **live** assist until Phase 2 identity and storage governance exist. Matching stays unblocked. No login wall.

Status: **scaffold** = not-live chrome exists. **open** = live LLM and milestones not built.

## Scaffold

Code exists. Not live LLM. No Assist button. No `/assist` route.

- **AI assist not-live chrome (Impl 58):** signed-in Account shows `BotOff` plus `cloud.assist` / `cloud.assistNotLive`. Matching still works.
- **Governance copy (Impl 94):** `cloud.assistGovernance` on that same chrome. When live, outputs stay reviewable, logged, and overridable. `AI assist` stays the label in both locales.

## Open

Not built. Needs Phase 2 identity and storage governance first. Model keys are not enough.

- **Milestone 3.1:** AI-assisted field extraction (complement deterministic scores; human approval).
- **Milestone 3.2:** Intelligent document classification.
- **Milestone 3.3:** Anomaly detection and exception prioritization (explainable flags).
- **Milestone 3.4:** Reviewer insights (governance for learning from corrections).

Milestone detail stays in [product-plan.md](../references/product-plan.md) Phase 3. Client BRD "AI vouching engine" and "advanced OCR extraction" stay here or later. Phase 1 Tesseract OCR and deterministic matching stay.

## Not this list

- Leftover B live R2 PutObject / Brevo (Phase 1 tracker).
- Phase 2 live host, live templates, live firm MFA, live GET-restore, live Super Admin: [phase2-remaining.md](phase2-remaining.md).
- Prep modules: [prep-modules-remaining.md](prep-modules-remaining.md).
- `phase4-remaining.md` is not a DocTrace file. EZAI Phase 4 stays regional SaaS.
