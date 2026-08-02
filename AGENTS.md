# AGENTS.md — bringing an LLM up to speed on this Companion module

Orientation for an AI assistant (or a new human) picking this project up cold. There is no
`CLAUDE.md` here; this is the entry point.

---

## 1. What this is

A **Bitfocus Companion connection module** for **PDF Presenter**. It lets a running
instance of the app be driven from a **Stream Deck** (or any other Companion surface):
next/previous slide, jump to a slide or a named section, start/stop the Output window,
black/white screen, laser pointer, timed auto-advance, and opening files from a watched
folder.

JavaScript, Node 22 runtime, `nodejs-ipc` API. Small repo — 15 tracked files, ~670 lines
across `src/`.

**The `-lite` in this repo's name is deliberate leftover.** The app was renamed from _PDF
Presenter Lite_ to **PDF Presenter** (the _Lite_ name now belongs to its hosted browser
build, which has no OSC and so nothing to do with this module). Every user-facing label
here follows the app, but `manifest.json`'s `id` and `name` stay `pdf-presenter-lite`, and
so does the repo — a module id is what an installed Companion config points at, so
changing it silently breaks every existing user's buttons. Do not "fix" the mismatch.

## 2. It talks OSC directly to the app — there is no middleware

This is the whole architecture, and the thing to understand first:

```
Companion surface  ──▶  this module  ──UDP OSC 35551──▶  PDF Presenter
                                     ◀──UDP OSC 35550──  (feedback)
```

The app has its own OSC listener. Nothing else is installed on the app side beyond clicking
**Start OSC** in its titlebar. So:

- **The protocol is owned by [`pdf-presenter-lite`](https://github.com/stoatworks-labs/pdf-presenter), not by this repo.**
  If you change an OSC address or payload there, this module breaks silently — a Stream Deck
  button simply stops working mid-show, with no error anywhere obvious. Change both together.
- Two ports, and they are **not** a request/response pair: 35551 is the app's inbound
  listener, 35550 is where this module listens for the app's feedback. Across machines, the
  app's own "Feedback host" must point back at the Companion machine's IP, not `127.0.0.1`.

## 3. It has a near-identical sibling

| Repo                                               | Controls                             |
| -------------------------------------------------- | ------------------------------------ |
| **companion-module-pdf-presenter-lite** (this)     | PDF Presenter                        |
| **companion-module-presentation-commander-client** | Presentation Commander's Client Node |

Same file layout, same OSC ports, same defaults, largely the same actions. The Client Node
module is a superset — it adds PowerPoint media transport and Program Out, and covers
Keynote/PowerPoint/Google Slides/Canva sources as well as PDF.

**Treat "the same bug probably exists in the sibling" as the default assumption.** A fix to
`osc.js` or `variables.js` here is worth checking there in the same sitting, and vice versa.

## 4. Layout

| File                      | Role                                                      |
| ------------------------- | --------------------------------------------------------- |
| `src/main.js`             | `InstanceBase` lifecycle, config fields, wiring           |
| `src/actions.js`          | The buttons — the bulk of the module                      |
| `src/feedbacks.js`        | Button lighting: slideshow state, OSC file access enabled |
| `src/variables.js`        | Text/state exposed to Companion expressions               |
| `src/osc.js`              | Send/receive, port handling, inbound address parsing      |
| `src/choices.js`          | Dropdown option lists                                     |
| `src/upgrades.js`         | Companion config migrations (currently a stub)            |
| `companion/manifest.json` | Module id, version, runtime declaration                   |

## 5. Deliberate omissions — do not "fix" these

There is **no feedback for laser-pointer-on or auto-advance-enabled.** The app's OSC
protocol never broadcasts either as a standalone value; only the combined
edit / running / running-with-auto-advance-paused slideshow state is sent. A feedback for
either would have to fabricate state the app does not provide, which is worse than not
having the button light up.

If you want those feedbacks, add the broadcast to the app first.

## 6. Context that matters

This drives live event production. A button press here changes what an audience sees. Prefer
failing safe — don't invent a state to display when the app connection is unknown, and keep
reconnection resilient: a surface that doesn't recover after the app restarts is a dead
surface mid-event.

## 7. Conventions

- Not in the official Companion module store — it installs via **Settings → Developer
  modules path**. Bear that in mind before writing install instructions that assume the store.
- Structural prior art is [`companion-module-zinc-oscpoint`](https://github.com/bitfocus/companion-module-zinc-oscpoint),
  read to learn the `InstanceBase` shape. **No code is reused from it** — keep it that way.
- Ships a user-facing AI-assisted disclaimer; review before relying on it in production.
- "Commit" means commit **and** push.
