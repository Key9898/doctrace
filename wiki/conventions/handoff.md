# Wiki, session, and Lark Task handoff

See also root [AGENTS.md](../../AGENTS.md) (source of truth for agents).

After each meaningful change batch, all four must happen:

1. Impl row in [implementation-phases.md](../architecture/implementation-phases.md)
2. Wiki note in `wiki/notes/`
3. Gitignored session file in `docs/sessions/`
4. Lark Task in the **chat reply**, not in committed wiki files

## Lark Task (chat only)

Emit one markdown fenced code block so the UI shows a copy button. Do not split the task across paragraphs.

```
=== LARK TASK — COPY FROM BELOW THIS LINE ===
Title: Impl N — <short what changed>

Notes:
- <bullet>
- <bullet>

Wiki: wiki/notes/YYYY-MM-DD-<slug>.md
Session: docs/sessions/YYYY-MM-DD-session-summary.md
=== LARK TASK — COPY UNTIL ABOVE THIS LINE ===
```

Same-day extra Impls: `docs/sessions/YYYY-MM-DD-session-summary-impl-NN.md`.
