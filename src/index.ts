import Overdrag, { ControlProps } from "overdrag";
import { CLASSES, CONSOLE_STYLE, LEVEL_COLORS, compileStyles } from "./styles";
import { ConsoleType, Levels, Styles } from "./types";

// Define gates object type that maps log levels to an array of allowed console methods
export type Gates = { [E in Levels]: ConsoleType[] };

// Define EntryInfo type for log entry information
type EntryInfo = {
  line: string | undefined;
  time: string;
};

// Define props interface for Chopper class
interface ChopperProps extends Partial<ControlProps> {
  name: string;
  level?: Levels;
  styles?: Styles;
  console?: boolean;
}

// Define time format options for Intl.DateTimeFormat
const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "numeric",
  second: "2-digit",
  fractionalSecondDigits: 3,
  hourCycle: "h23",
};

// Define Chopper class
export default class Chopper extends Overdrag {
  protected level: Levels;
  protected readonly name: string;
  protected readonly styles: Styles;
  protected readonly headerElement: HTMLElement;
  protected readonly titleElement: HTMLElement;
  protected readonly badgeElement: HTMLElement;
  protected readonly outputElement: HTMLElement;
  protected readonly logLevelElement: HTMLElement;
  protected readonly pinnedOutputElement: HTMLElement;
  protected readonly displayElement: HTMLElement;
  protected readonly statusElement: HTMLElement;
  printToConsole: boolean;
  render = true;
  bufferSize = 100;
  bufferPausedSize = 1000;
  private readonly pinned: Map<
    ConsoleType,
    { info: EntryInfo; data: unknown[] }
  > = new Map();

  // Create pin methods for each console method
  readonly $pin = {
    debug: (...data: unknown[]) => this.pin("debug", data),
    log: (...data: unknown[]) => this.pin("log", data),
    info: (...data: unknown[]) => this.pin("info", data),
    warn: (...data: unknown[]) => this.pin("warn", data),
    error: (...data: unknown[]) => this.pin("error", data),
  };

  // Define the gate object that maps log levels to allowed console methods
  private readonly gate: Gates = {
    verbose: ["debug", "log", "info", "warn", "error"],
    info: ["info", "warn", "error"],
    warn: ["warn", "error"],
    error: ["error"],
    none: [],
  };

  constructor({
    console = true,
    level = "verbose",
    name,
    styles,
    element,
    maxContentHeight,
    maxContentWidth,
    minContentHeight = 100,
    minContentWidth = 200,
    snapThreshold,
    controlsThreshold,
    clickDetectionThreshold,
  }: ChopperProps) {
    // Create a new element if none is provided
    if (!element) {
      element = document.createElement("div");
      document.body.appendChild(element);
      element.style.left = `${Math.floor(
        Math.random() * (window.innerWidth - parseInt(CLASSES.container.width))
      )}px`;
      element.style.top = `${Math.floor(
        Math.random() *
          (window.innerHeight - parseInt(CLASSES.container.height))
      )}px`;
    }
    super({
      element,
      maxContentHeight,
      maxContentWidth,
      minContentHeight,
      minContentWidth,
      snapThreshold,
      controlsThreshold,
      clickDetectionThreshold,
    });
    this.level = level;
    this.name = name;
    this.styles = compileStyles({ ...CONSOLE_STYLE, ...styles });
    this.printToConsole = console;

    this.setupElement();
    this.headerElement = this.createInternalElement({
      parent: this.element,
      type: "div",
      classNames: ["chopper-header"],
    });
    this.titleElement = this.createInternalElement({
      parent: this.headerElement,
      type: "div",
      classNames: ["chopper-title"],
      text: this.name,
    });
    this.badgeElement = this.createInternalElement({
      parent: this.headerElement,
      type: "div",
      classNames: ["chopper-badge"],
      text: "devtools-chopper by Protosus",
    });

    this.displayElement = this.createInternalElement({
      parent: this.element,
      type: "div",
      classNames: ["chopper-display"],
    });
    this.outputElement = this.createInternalElement({
      parent: this.displayElement,
      type: "div",
      classNames: ["chopper-output"],
    });
    this.pinnedOutputElement = this.createInternalElement({
      parent: this.displayElement,
      type: "div",
      classNames: ["chopper-pinned-output"],
    });
    this.logLevelElement = this.createInternalElement({
      parent: this.titleElement,
      type: "div",
      classNames: ["chopper-level"],
      text: this.level,
    });

    this.statusElement = this.createInternalElement({
      parent: this.titleElement,
      type: "div",
      classNames: ["chopper-status"],
      text: "click to pause",
    });

    this.enableLogLevelSwitching();

    this.on("click", () => {
      this.render = !this.render;
      this.statusElement.innerText = this.render ? "click to pause" : "paused";
    });

    this.outputElement.addEventListener("scroll", () => {
      this.render =
        this.outputElement.scrollHeight -
          this.outputElement.scrollTop -
          this.outputElement.getBoundingClientRect().height <
        5;

      this.statusElement.innerText = this.render ? "click to pause" : "paused";
    });
  }

  private enableLogLevelSwitching() {
    // Make logLevelElement clickable that changes log level
    this.logLevelElement.addEventListener("click", () => {
      const levels = Object.keys(this.gate) as Levels[];
      const index = levels.indexOf(this.level);
      this.level = levels[(index + 1) % levels.length];
      this.logLevelElement.innerText = this.level;

      this.setLevelButtonColor();
    });

    this.setLevelButtonColor();
  }

  private setLevelButtonColor() {
    // Change the background color of the logLevelElement based on the log level
    this.logLevelElement.style.backgroundColor =
      LEVEL_COLORS[this.level].backgroundColor || "transparent";

    // Change the color of the logLevelElement based on the log level
    this.logLevelElement.style.color =
      LEVEL_COLORS[this.level].color || "black";

    // Change outline color of the logLevelElement based on the log level
    this.logLevelElement.style.outlineColor =
      LEVEL_COLORS[this.level].color || "black";
  }

  private createInternalElement({
    parent,
    type,
    classNames,
    text,
  }: {
    parent: HTMLElement;
    type: string;
    classNames: string[];
    text?: string;
  }) {
    const element = document.createElement(type);
    element.classList.add(...classNames);
    if (text) element.innerText = text;
    parent.appendChild(element);
    return element;
  }

  private setupElement() {
    this.element.classList.add("chopper-container");
    this.element.style.width = CLASSES.container.width;
    this.element.style.height = CLASSES.container.height;
  }

  // Set log level
  setLogLevel(level: Levels) {
    this.level = level;
  }

  private getLogInfo(stackIndex: number): EntryInfo {
    const time = new Date().toLocaleTimeString("en-US", TIME_FORMAT);
    const line = (new Error().stack?.split("\n") || [])[stackIndex]?.replace(
      /^\s+at\s+/,
      ""
    );

    return { time, line };
  }

  console(data: unknown[], type: ConsoleType, info: EntryInfo) {
    if (!this.printToConsole) return;
    console[type](
      `%c${this.name} [${info.time}] (${type}) ${info.line}\n`,
      this.styles[type],
      ...data
    );
  }

  private renderOutput(data: unknown[], type: ConsoleType) {
    // Filter out the types that are not allowed
    if (!this.gate[this.level].includes(type)) return;

    const info = this.getLogInfo(4);
    // TODO: Detect data types and JSON.parse the objects with indentation
    this.console(data, type, info);

    // If the console is paused, only render the output if the number of elements is less than the limit
    if (
      !this.render &&
      this.outputElement.children.length > this.bufferPausedSize
    ) {
      return;
    }

    this.renderEntry(this.outputElement, data, type, info);

    if (!this.render) return;
    // Remove elements if the number of elements is greater than the limit
    while (
      this.outputElement.firstChild &&
      this.outputElement.children.length > this.bufferSize
    ) {
      this.outputElement.removeChild(this.outputElement.firstChild);
    }

    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }

  /**
   * Render the entry to the output element
   */
  renderEntry(
    parent: HTMLElement,
    data: unknown[],
    type: ConsoleType,
    info: EntryInfo
  ) {
    const entry = this.createInternalElement({
      parent,
      type: "div",
      classNames: [`chopper-entry`, `chopper-${type}`],
    });
    // On hover, display the stack trace as a tooltip
    entry.setAttribute("title", `${type}@${info.line}`);

    const details = this.createInternalElement({
      parent: entry,
      type: "div",
      classNames: ["chopper-details"],
    });

    this.createInternalElement({
      parent: details,
      type: "span",
      classNames: ["chopper-time"],
      text: `${type}@${info.time}`,
    });

    this.createInternalElement({
      parent: details,
      type: "span",
      classNames: ["chopper-line"],
      text: (info.line || "")
        .replace(location.origin, "")
        .replace(/\?t=\d+/, ""),
    });

    this.createInternalElement({
      parent: entry,
      type: "pre",
      classNames: ["chopper-data"],
      text: "> " + data.join("\n> "),
    });

    return entry;
  }

  private renderPinned() {
    this.pinnedOutputElement.innerHTML = "";
    this.pinned.forEach(({ data, info }, type) => {
      // Filter out the types that are not allowed
      if (!this.gate[this.level].includes(type)) return;
      this.renderEntry(this.pinnedOutputElement, data, type, info);
    });
  }

  private readonly pin = (level: ConsoleType, data: unknown[]) => {
    const info = this.getLogInfo(4);
    this.console(data, level, info);
    this.pinned.set(level, { data, info });
    this.renderPinned();
  };

  readonly $debug = (...data: unknown[]) => {
    this.renderOutput(data, "debug");
  };

  readonly $log = (...data: unknown[]) => {
    this.renderOutput(data, "log");
  };

  readonly $info = (...data: unknown[]) => {
    this.renderOutput(data, "info");
  };

  readonly $warn = (...data: unknown[]) => {
    this.renderOutput(data, "warn");
  };

  readonly $error = (...data: unknown[]) => {
    this.renderOutput(data, "error");
  };
}
