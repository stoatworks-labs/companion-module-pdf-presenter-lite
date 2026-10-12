# companion-module-pdf-presenter-lite

> **AI-assisted project.** This module was created with [Claude](https://claude.com/claude-code)
> (Anthropic), directed and reviewed by a human author. Check it over before you rely on it for
> a show.

A [Bitfocus Companion](https://bitfocus.io/companion) module for
[PDF Presenter](https://github.com/stoatworks-labs/pdf-presenter), so you can run
the app from a Stream Deck (or any other Companion surface) over its OSC control
protocol.

It talks straight to the app's own OSC listener (UDP, port 35551 by default)
and listens for feedback on a local port (35550 by default). There's nothing
extra to install on the app end: you turn OSC on in its titlebar, and that's it.

<!-- downloads:start -->

## Download

**[v1.3.1](https://github.com/stoatworks-labs/companion-module-pdf-presenter-lite/releases/tag/v1.3.1)**

This release contains:

- [`companion-module-pdf-presenter-lite-pkg.tgz`](https://github.com/stoatworks-labs/companion-module-pdf-presenter-lite/releases/latest/download/companion-module-pdf-presenter-lite-pkg.tgz) — npm package, 55 KB
- [`pdf-presenter-lite-1.3.1.tgz`](https://github.com/stoatworks-labs/companion-module-pdf-presenter-lite/releases/download/v1.3.1/pdf-presenter-lite-1.3.1.tgz) — npm package, 55 KB

All builds, checksums and release notes: [github.com/stoatworks-labs/companion-module-pdf-presenter-lite/releases](https://github.com/stoatworks-labs/companion-module-pdf-presenter-lite/releases).

<!-- downloads:end -->

## What it does

- **Actions:** Next/Previous slide, go to a slide number, go to the first/last
  slide, go to a named section (or the next/previous section), start/stop
  the Output window, toggle black/white screen, toggle the laser pointer
  overlay, set the current slide as the desktop wallpaper, pause/resume timed
  auto-advance, set the slide transition (effect, direction and duration,
  all together or one at a time), enable/disable OSC actions or feedback, ask
  for a feedback refresh, set the watched folder, ask for its file list, and
  open a file from it by name.
- **Feedbacks:** _Slideshow state_ (edit / running / running-with-auto-advance-paused),
  _Slide transition effect_, _Slide transition direction_, and
  _OSC file access enabled_.
- **Variables:** presentation name, slide count (total and visible),
  state, current slide, slides remaining, current section index/name/
  slides-remaining, derived previous/next section name and first slide,
  file-access-enabled, watched folder (relative and full path), the
  watched folder's file count/name list, and the current transition
  (effect, direction, duration, plus the whole thing as JSON).
- The section and file-open actions give you a live dropdown of whatever the
  app last reported, plus a custom value that takes variables, for when you
  want it to change on the fly.

The transition effect and direction dropdowns are fixed lists copied from the
app, not discovered from it, because the app reports which transition is
selected but never which ones it supports. It also ignores any name it doesn't
recognise, silently and on purpose, so a typo can't change the look of a live
show. In practice that means a module older than the app won't offer a newer
effect, and won't misbehave if you type one in.

What I've left out on purpose: a feedback for the laser pointer being on or
for auto-advance being enabled. The app's OSC protocol never broadcasts either
as a value of its own (it only sends the combined edit/running/paused slideshow
state), so a feedback for either would have to make up data the app doesn't
provide.

## Setup

1. Install and enable this module in Companion (see **Installing** below).
2. In PDF Presenter, click **Start OSC** in the titlebar (once you've started
   it once, it remembers across restarts).
3. Add a new connection using this module, and set:
   - **App host:** the machine running PDF Presenter (default
     `127.0.0.1`, meaning Companion's on the same machine).
   - **App listen port:** default `35551`, which matches the app's own default.
   - **Local feedback port:** default `35550`, which matches the app's own
     default.
4. If Companion and the app are on different machines, change **App
   host** to the app's actual IP, and make sure "Feedback host" in the app's
   OSC settings panel points back at the Companion machine's IP (not
   `127.0.0.1`).

## Installing (Developer Modules Path)

This module isn't in the official Companion module store, so install it as
a developer module:

1. Clone this repo, then `npm install`.
2. In Companion, go to **Settings → Developer modules path** and point it
   at the parent folder that contains this repo's folder.
3. Restart Companion (or use its "Rescan for developer modules" action, if
   your version has it), and "PDF Presenter" turns up as a connection module
   you can install.

## Inspiration & prior art

- **[companion-module-zinc-oscpoint](https://github.com/bitfocus/companion-module-zinc-oscpoint)**:
  the official, MIT-licensed Companion module for OSCPoint. Its source
  (`main.js`/`config.js`/`actions.js`/`feedbacks.js`/`variables.js`/
  `osc-listener.js`/`presets.js`) was read in full, before this module was
  written from scratch, to learn what a working Bitfocus Companion module
  looks like: the `InstanceBase` lifecycle, config field shapes,
  `self.oscSend`, and how actions/feedbacks/variables/presets get registered.
  None of its code is reused here. Every address string, variable and helper
  in this repo is written against PDF Presenter Lite's own protocol (renamed,
  and no longer OSCPoint-branded), and the file and function names are
  different throughout. It showed how a Companion module is put together, and
  that's all it was used for; no code was copied from it.
- **[OSCPoint](https://github.com/phuvf/oscpoint)** itself: see
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

- `setVariableDefinitions` was being handed an array. Base 2.x throws
  `Variable definitions should be an object, not an array` outright, which fails
  `init()` and leaves the connection dead, with no actions, no feedbacks and no
  obvious cause. It's now the object form the API wants.
- `osc`'s `UDPPort.close()` doesn't take a callback, so the
  `new Promise((r) => port.close(r))` this used never settled. `destroy()` hung,
  and `configUpdated()` never got past the close to reconnect, so editing the
  host or port killed the instance until you restarted Companion. It now waits
  for the port's `close` event, with a timeout.

**New: presets.** Ready-made button banks with their feedbacks and variables
already wired up.

**New: `npm test`**, a regression harness that runs the module's actual code
against a pretend app on a real UDP socket, and covers all three of the above.

<!-- attributions:start -->
This project is built on other people's work — see [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
<!-- attributions:end -->
