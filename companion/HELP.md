# PDF Presenter

Drives [PDF Presenter](https://github.com/stoatworks-labs/pdf-presenter) over
OSC — slides, sections, black and white screen, the laser pointer, and the
watched folder.

## Connection

**Start OSC in the app first**, from the button in its titlebar. It is
remembered after the first time, but until it has been pressed once the app is
not listening and the connection sits there looking broken.

| | default | |
| --- | --- | --- |
| **App host** | `127.0.0.1` | the machine running PDF Presenter |
| **App listen port** | `35551` | matches the app's own default |
| **Local feedback port** | `35550` | matches the app's own default |

Across two machines, change **App host** to the app's real address **and** point
the app's own *Feedback host* back at the Companion machine. Leaving that at
`127.0.0.1` is the usual reason actions work while nothing ever lights up.

## Moving around a deck

Next and previous, a slide number, first and last — and **sections**, which are
the ones worth putting on a surface. Next section, previous section, or a named
one, with variables for the current section's name, its index and how many
slides are left in it.

The section and file-open dropdowns list **whatever the app last reported**, and
both accept a custom value with variables in it if you would rather build the
name on the fly.

## Transitions

Effect, direction and duration, together or one at a time. The two dropdowns are
**fixed lists mirrored from the app rather than discovered from it** — the app
says which transition is selected, never which ones it knows. Two consequences,
both harmless: a module older than the app will not offer a newer effect, and a
name the app does not recognise is ignored silently, deliberately, so a typo
cannot change the look of a live show.

## What deliberately has no feedback

There is no feedback for *laser pointer on* or *auto-advance enabled*. The app's
OSC protocol never broadcasts either as a value of its own — only the combined
edit / running / running-with-auto-advance-paused state — so a button claiming
to show it would be inventing data. Use the slideshow-state feedback, which is
real.
