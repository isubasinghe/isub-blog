# Clock Components Completion — Design

**Date:** 2026-05-11
**Scope:** Finish the half-implemented Berkeley clock-sync demo and the vector clock demo under `src/components/`.

## Context

Two interactive Solid.js components exist as stubs:

- `src/components/clock/Berkeley.tsx` + `src/components/clock/Clock.tsx` — a master clock and three drifting slaves, plus a shared `deltas` store with `UPDATE_DELTA` / `RESET_DELTA` actions. Each clock applies and clears its own delta when set. **What's missing:** nothing ever initiates a sync round, so the deltas are always zero and the slaves drift forever.
- `src/components/VClock.tsx` — two nodes with a vector clock each, Add / Minus / Send buttons. `updateSelf` already bumps the local component on Add/Minus, and `sendUpdate` already bumps it on Send. **What's missing:** `receiveUpdate` is an explicit placeholder — it does nothing.

Both components are mounted in `src/pages/test.astro`. There is a precedent for richer step-stepped animations elsewhere in the repo (`MESIAnimation.tsx`), but the chosen direction for these two is to keep the existing small "live simulation" style and just fill in the missing algorithm.

## Non-goals

- No new dependencies.
- No tests for these components (no component-test infra exists yet; the behaviour is timing- and animation-driven).
- No changes to `Gossip.tsx`, `test.astro`, or any wiki code.
- No richer animation framework (no step controls, no in-flight arrows).

## Berkeley clock sync

### Algorithm

Every 5 seconds the master initiates a sync round:

1. Collect the current `counter` of each clock (master + 3 slaves).
2. Compute `avg = Math.round(sum(counters) / counters.length)`. Off-by-one drift between rounds is fine for a visual demo.
3. For each clock id `i`, dispatch `UPDATE_DELTA { id: i, delta: avg - counter_i }`. The delta may be zero, positive, or negative.
4. On its next tick, each clock applies its own delta to `counter`, dispatches `RESET_DELTA`, and flashes the delta text — this part is already implemented in `Clock.tsx`.

### Code shape

Extend the shared store from `{ deltas }` to `{ counters, deltas }`. Each clock writes its current counter into `state.counters[id]` on every tick, alongside the existing local `setCounter`. The master reads `state.counters` at sync time.

Two new dispatch actions:

- `REPORT_COUNTER { id, value }` — written by each clock on every tick.
- `START_SYNC` — fired by the master's interval; the reducer reads all `counters`, computes the average, and writes the resulting deltas. (Keeping the logic inside the reducer rather than in component code mirrors the existing pattern.)

`Berkeley.tsx` owns a `setInterval(5000)` (cleaned up on unmount via `onCleanup`) that dispatches `START_SYNC`. It also tracks a `syncing` signal that flashes the master clock's border for ~300 ms each round, so the user can see "a round just happened".

Slave correction is already visible via the existing `deltaLocal` flash in `Clock.tsx`. No further visual changes needed there.

### Edge cases

- First couple of ticks: `state.counters` may not yet have an entry for every id. Skip the sync round (or treat missing entries as 0) until all four clocks have reported at least once.
- Negative deltas: counters can go down. Allowed. The existing `showText` already handles the `<= 0` case.
- Component unmount mid-round: `onCleanup` clears both the per-clock interval and the master's sync interval. No outstanding promises to cancel.

## Vector clocks

### Algorithm

Local event (Add / Minus button): increment own state, increment own component of own vclock. **Already implemented.**

Send: bump own component, then deliver `(state, vclock_snapshot)` to the receiver. **Already implemented.**

Receive (the placeholder to fill in):

Note on data shape: each node owns a `clocks: Record<number, {counter, state}>` store. The "vector clock as seen by node X" is `{ k: clocks[k].counter | for each k }` — i.e. the `counter` field of every entry, keyed by node id, is the vector component for that node.

1. For every key `k` in the union of `self.clocks` and the received `vclocks`, set `self.clocks[k].counter = max(self.clocks[k]?.counter ?? 0, vclocks[k]?.counter ?? 0)`. New keys get inserted with `state: 0`.
2. Increment `self.clocks[self.id].counter` by 1 (the receive event itself).
3. **Do not** adopt the sender's `state` value — merge the vector clock only. This keeps the demo as a faithful illustration of what a vector clock is, rather than a state-replication demo.

After this, `V[0]` and `V[1]` populate on both nodes' rows the first time a message is exchanged, which is the visible takeaway.

### Code shape

Replace the body of `receiveUpdate` in `createVClock` with the merge + bump above. The function signature stays `(_newState: number, vclocks: Record<number, Value>) => void`; the `_newState` argument is intentionally unused (kept for the existing call shape from `sendUpdate`).

The `<For each={Object.keys(...)}>` over `clock0.clocks` and `clock1.clocks` already renders each known component; once `receiveUpdate` populates entries for the other node's id, the table will automatically grow a column.

### Visible cue

Add a one-shot `flash` signal on each clock that turns true for ~400 ms when `receiveUpdate` runs. Bind it to a CSS class on the receiver's `<tr>` (e.g. light yellow background fade-out). This is the only new visual; no in-flight arrow.

### Edge cases

- Receiver has no entry yet for the sender's id: handled by `?? 0` in the merge step.
- Send-to-self: not a real concern since each component has hard-coded `clock0` / `clock1` send buttons that target the other. No guard needed.
- The existing `<Show when={clock0.clocks[0] && clock1.clocks[1]}>` keeps rendering tidy.

## Files touched

- `src/components/clock/Clock.tsx` — write counter into `state.counters` each tick; accept the extended store type.
- `src/components/clock/Berkeley.tsx` — extend store, add `REPORT_COUNTER` / `START_SYNC` actions, add sync interval, add master flash signal + style.
- `src/components/VClock.tsx` — implement `receiveUpdate`, add receive flash signal + style.

No other files change.

## Out of scope follow-ups

- Component-level tests once a test harness for Solid components exists in this repo.
- Richer stepped-animation versions of either component (could live alongside, not replace, the live versions).
- Wiring these into actual wiki entries — currently they only live on `test.astro`.
