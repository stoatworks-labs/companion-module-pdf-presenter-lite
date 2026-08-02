# companion-module-pdf-presenter-lite

> **AI-assisted project.** This module was built with the help of
> [Claude](https://claude.ai), Anthropic's AI assistant — including
> implementation and documentation. Review it accordingly before relying on
> it in production.

A [Bitfocus Companion](https://bitfocus.io/companion) connection module for
[PDF Presenter](https://github.com/stoatworks-labs/pdf-presenter) —
control a running instance from a Stream Deck or any other Companion
surface over its OSC control protocol.

It talks directly to the app's own OSC listener (UDP, default port 35551)
and receives feedback on a local port (default 35550) — no separate
integration to install on the app side beyond turning OSC on in its
titlebar.

## What it does

- **Actions** — Next/Previous slide, go to slide number, go to first/last
  slide, go to a named section (or the next/previous section), start/stop
  the Output window, toggle black/white screen, toggle the laser pointer
  overlay, set the current slide as desktop wallpaper, pause/resume timed
  auto-advance, enable/disable OSC actions or feedback, request a feedback
  refresh, set the watched folder, request its file list, and open a file
  from it by name.
- **Feedbacks** — _Slideshow state_ (edit / running / running-with-auto-advance-paused)
  and _OSC file access enabled_.
- **Variables** — presentation name, slide count (total and visible),
  state, current slide, slides remaining, current section index/name/
  slides-remaining, derived previous/next section name and first slide,
  file-access-enabled, watched folder (relative and full path), and the
  watched folder's file count/name list.
- Section and file-open actions offer a live dropdown of whatever the app
  last reported, with a variables-aware custom-value option for dynamic
  use.

**Deliberately not built**: a feedback for laser-pointer-on or
auto-advance-enabled state — the app's OSC protocol never actually
broadcasts either as a standalone value (only the combined
edit/running/paused slideshow state is sent), so a feedback for either
would have to fabricate data the app doesn't provide.

## Setup

1. Install and enable this module in Companion (see **Installing** below).
2. In PDF Presenter, click **Start OSC** in the titlebar (it's
   remembered across restarts once started once).
3. Add a new connection using this module, and set:
   - **App host** — the machine running PDF Presenter (default
     `127.0.0.1`, i.e. Companion running on the same machine).
   - **App listen port** — default `35551`, matches the app's own default.
   - **Local feedback port** — default `35550`, matches the app's own
     default.
4. If Companion and the app are on different machines, change **App
   host** to the app's real IP, and make sure its OSC settings panel's
   "Feedback host" points back at the Companion machine's IP (not
   `127.0.0.1`).

## Installing (Developer Modules Path)

This module isn't in the official Companion module store — install it as
a developer module:

1. Clone this repo, then `npm install`.
2. In Companion, go to **Settings → Developer modules path** and point it
   at the parent directory containing this repo's folder.
3. Restart Companion (or use its "Rescan for developer modules" action if
   available in your version) — "PDF Presenter" appears as an
   installable connection module.

## Inspiration & prior art

- **[companion-module-zinc-oscpoint](https://github.com/bitfocus/companion-module-zinc-oscpoint)** —
  the real, official, MIT-licensed Companion module for OSCPoint. Its
  source (`main.js`/`config.js`/`actions.js`/`feedbacks.js`/`variables.js`/
  `osc-listener.js`/`presets.js`) was read in full to learn what a real
  Bitfocus Companion module actually looks like — the `InstanceBase`
  lifecycle, config field shapes, `self.oscSend`, and how actions/
  feedbacks/variables/presets get registered — before writing this module
  from scratch. No lines of its code are reused here: every address string,
  variable, and helper in this repo is written against PDF Presenter
  Lite's own (renamed, no-longer-OSCPoint-branded) protocol, and file/
  function names differ throughout. It was a structural reference for "how
  do you build a Companion module," not a source of copied code.
- **[OSCPoint](https://github.com/phuvf/oscpoint)** itself — see
  [PDF Presenter's own README](https://github.com/stoatworks-labs/pdf-presenter#inspiration--prior-art)
  for how it shaped the app whose protocol this module speaks.

## Project Setup

```bash
npm install
npm run format   # prettier
npm run package  # builds a distributable module package
```

## What changed in 1.1.0

**Two bugs that made this module fail against `@companion-module/base` 2.x:**

- `setVariableDefinitions` was being handed an **array**. Base 2.x throws
  `Variable definitions should be an object, not an array` outright, which fails
  `init()` and leaves the connection dead — no actions, no feedbacks, and no
  obvious cause. It is now the object form the API requires.
- `osc`'s `UDPPort.close()` takes **no callback**, so the
  `new Promise((r) => port.close(r))` this used never settled. `destroy()` hung,
  and `configUpdated()` never got past the close to reconnect — editing the host
  or port killed the instance until Companion was restarted. It now awaits the
  port's `close` event, with a timeout.

**New: presets.** Ready-made button banks with their feedbacks and variables
already wired.

**New: `npm test`** — a regression harness that drives the real source against a
fake app on a real UDP socket, and covers all three of the above.
