import { InstanceBase, Regex, InstanceStatus } from "@companion-module/base";
import { UpgradeScripts } from "./upgrades.js";
import UpdateActions from "./actions.js";
import UpdateFeedbacks from "./feedbacks.js";
import UpdateVariableDefinitions from "./variables.js";
import oscListener from "./osc.js";

function defaultState() {
  return {
    presentation: null,
    sections: [],
    presentationName: "",
    slideCount: 0,
    slideCountVisible: 0,
    state: "edit",
    currentSlide: 0,
    slidesRemaining: 0,
    sectionIndex: 0,
    sectionName: "",
    sectionSlidesRemaining: 0,
    previousSectionName: "",
    previousSectionFirstSlide: 0,
    nextSectionName: "",
    nextSectionFirstSlide: 0,
    filesEnabled: false,
    activeFolder: "",
    activeFolderFullPath: "",
    files: [],
  };
}

export default class ModuleInstance extends InstanceBase {
  constructor(internal) {
    super(internal);
    this.state = defaultState();
  }

  async init(config) {
    this.config = config;
    this.state = defaultState();
    this.updateStatus(
      InstanceStatus.Connecting,
      `Connecting to port ${this.config.localport}...`,
    );
    this.updateActions();
    this.updateFeedbacks();
    this.updateVariableDefinitions();
    this.refreshVariableValues();
    await oscListener.connect(this);
  }

  async destroy() {
    await oscListener.close();
  }

  async configUpdated(config) {
    this.config = config;
    this.updateStatus(InstanceStatus.Connecting, "Reconnecting...");
    await oscListener.close();
    await oscListener.connect(this);
  }

  getConfigFields() {
    return [
      {
        type: "static-text",
        id: "info",
        width: 12,
        label: "Connection",
        value:
          "PDF Presenter's own OSC settings panel shows its listen/feedback ports — match them here. Defaults line up with the app's own defaults.",
      },
      {
        type: "textinput",
        id: "remotehost",
        label: "App host",
        width: 6,
        regex: Regex.IP,
        default: "127.0.0.1",
      },
      {
        type: "textinput",
        id: "remoteport",
        label: "App listen port",
        width: 6,
        regex: Regex.PORT,
        default: "35551",
      },
      {
        type: "textinput",
        id: "localport",
        label: "Local feedback port",
        width: 6,
        regex: Regex.PORT,
        default: "35550",
      },
    ];
  }

  refreshVariableValues() {
    this.setVariableValues({
      presentationName: this.state.presentationName,
      slideCount: this.state.slideCount,
      slideCountVisible: this.state.slideCountVisible,
      state: this.state.state,
      currentSlide: this.state.currentSlide,
      slidesRemaining: this.state.slidesRemaining,
      sectionIndex: this.state.sectionIndex,
      sectionName: this.state.sectionName,
      sectionSlidesRemaining: this.state.sectionSlidesRemaining,
      previousSectionName: this.state.previousSectionName,
      previousSectionFirstSlide: this.state.previousSectionFirstSlide,
      nextSectionName: this.state.nextSectionName,
      nextSectionFirstSlide: this.state.nextSectionFirstSlide,
      fileAccessEnabled: this.state.filesEnabled,
      activeFolder: this.state.activeFolder,
      activeFolderFullPath: this.state.activeFolderFullPath,
      activeFolderFileCount: this.state.files.length,
      activeFolderFileNames: JSON.stringify(this.state.files),
    });
  }

  updateActions() {
    UpdateActions(this);
  }

  updateFeedbacks() {
    UpdateFeedbacks(this);
  }

  updateVariableDefinitions() {
    UpdateVariableDefinitions(this);
  }
}

export { UpgradeScripts };
