import {
  TRANSITION_EFFECT_CHOICES,
  TRANSITION_DIRECTION_CHOICES,
} from "./choices.js";

export default function UpdateFeedbacks(self) {
  self.setFeedbackDefinitions({
    slideshowState: {
      type: "boolean",
      name: "Slideshow state",
      description:
        "Highlights the button when the Output window is in the given state.",
      defaultStyle: { bgcolor: 0xcc0000, color: 0xffffff },
      options: [
        {
          id: "state",
          type: "dropdown",
          label: "State",
          choices: [
            { id: "edit", label: "Edit (Output closed)" },
            { id: "running", label: "Running" },
            { id: "paused", label: "Running, auto-advance paused" },
          ],
          default: "running",
        },
      ],
      callback: (feedback) => self.state.state === feedback.options.state,
    },
    // Unlike the laser pointer and auto-advance (see presets.js), the app does
    // broadcast the transition as a standalone value — so a bank of transition
    // buttons can genuinely light the one that is selected rather than guess.
    transitionEffect: {
      type: "boolean",
      name: "Slide transition effect",
      description:
        "Highlights the button when the given transition effect is the one selected.",
      defaultStyle: { bgcolor: 0x0066cc, color: 0xffffff },
      options: [
        {
          id: "effect",
          type: "dropdown",
          label: "Effect",
          choices: TRANSITION_EFFECT_CHOICES,
          default: "fade",
        },
      ],
      callback: (feedback) =>
        self.state.transitionEffect === feedback.options.effect,
    },
    transitionDirection: {
      type: "boolean",
      name: "Slide transition direction",
      description:
        "Highlights the button when the given transition direction is the one selected. The app keeps a direction set even under an effect that ignores it, so pair this with the effect feedback if that matters.",
      defaultStyle: { bgcolor: 0x0066cc, color: 0xffffff },
      options: [
        {
          id: "direction",
          type: "dropdown",
          label: "Direction",
          choices: TRANSITION_DIRECTION_CHOICES,
          default: "left",
        },
      ],
      callback: (feedback) =>
        self.state.transitionDirection === feedback.options.direction,
    },
    filesEnabled: {
      type: "boolean",
      name: "OSC file access enabled",
      description:
        "Highlights the button while the watched-folder OSC file actions are enabled.",
      defaultStyle: { bgcolor: 0x00aa00, color: 0xffffff },
      options: [],
      callback: () => !!self.state.filesEnabled,
    },
  });
}
