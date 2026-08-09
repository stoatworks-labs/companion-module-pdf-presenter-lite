// Dropdown choice lists derived from the last-received OSC feedback
// (self.state, updated by osc.js) — shared between actions.js and
// feedbacks.js so both stay in sync with whatever the app's current
// sections/files actually are, instead of requiring the operator to know
// exact names by heart.

export function sectionChoices(self) {
  return (self.state.sections ?? []).map((s) => ({
    id: s.name,
    label: s.name,
  }));
}

export function fileChoices(self) {
  return (self.state.files ?? []).map((name) => ({ id: name, label: name }));
}

// Unlike sections and files, these two are FIXED lists, mirrored from the
// app's src/shared/transitions.ts. The app never broadcasts what it supports,
// only what is currently selected — so a value the app doesn't recognise is a
// silent no-op there, and these lists are the only thing stopping an operator
// picking one. Keep them in step with the app.
export const TRANSITION_EFFECT_CHOICES = [
  { id: "cut", label: "Cut" },
  { id: "fade", label: "Fade" },
  { id: "dip-black", label: "Dip to black" },
  { id: "dip-white", label: "Dip to white" },
  { id: "push", label: "Push" },
  { id: "wipe", label: "Wipe" },
  { id: "cover", label: "Cover" },
  { id: "uncover", label: "Uncover" },
  { id: "zoom", label: "Zoom" },
];

// Named for where the NEW slide comes from; everything travels away from that
// edge. Only push/wipe/cover/uncover read it.
export const TRANSITION_DIRECTION_CHOICES = [
  { id: "left", label: "From left" },
  { id: "top-left", label: "From top left" },
  { id: "top", label: "From top" },
  { id: "top-right", label: "From top right" },
  { id: "right", label: "From right" },
  { id: "bottom-right", label: "From bottom right" },
  { id: "bottom", label: "From bottom" },
  { id: "bottom-left", label: "From bottom left" },
];

/** Matches the app's own clamp — a button that sends 10000 would otherwise
 * report back a duration it never set. */
export const TRANSITION_MIN_MS = 50;
export const TRANSITION_MAX_MS = 5000;
