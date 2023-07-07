import Overdrag, { ControlProps } from "overdrag";
import { CLASSES, CONSOLE, LEVEL_COLORS } from "./styles";

/** log levels available*/
export type Levels = "none" | "verbose" | "info" | "warn" | "error";
/** io methods */
export type ConsoleType = "debug" | "log" | "info" | "error" | "warn";
export type Gates = { [E in Levels]: ConsoleType[] };
export type Styles = { [E in ConsoleType]?: Partial<CSSStyleDeclaration> };

type EntryInfo = {
  line: string | undefined;
  time: string;
  stack: string[];
};

interface LogEmitterProps extends ControlProps {
  name?: string;
  level?: Levels;
  styles?: Styles;
}

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "numeric",
  second: "2-digit",
  // @ts-ignore
  fractionalSecondDigits: 3,
  hourCycle: "h23",
};

export default class LogEmitter extends Overdrag {
  protected level: Levels;
  protected readonly name: string;
  protected readonly styles: Styles;
  protected readonly headerElement: HTMLElement;
  protected readonly titleElement: HTMLElement;
  protected readonly badgeElement: HTMLElement;
  protected readonly outputElement: HTMLElement;
  protected readonly logLevelElement: HTMLElement;
  protected readonly pinnedOutputElement: HTMLElement;

  //   private readonly buffer: { level: Levels; out: string }[] = [];
  //   readonly bufferLength = 10;
  private readonly pinned: Map<
    ConsoleType,
    { info: EntryInfo; data: unknown[] }
  > = new Map();

  readonly $pin = {
    debug: (...data: unknown[]) => this.pin("debug", data),
    log: (...data: unknown[]) => this.pin("log", data),
    info: (...data: unknown[]) => this.pin("info", data),
    warn: (...data: unknown[]) => this.pin("warn", data),
    error: (...data: unknown[]) => this.pin("error", data),
  };

  private readonly gate: Gates = {
    verbose: ["debug", "log", "info", "warn", "error"],
    info: ["info", "warn", "error"],
    warn: ["warn", "error"],
    error: ["error"],
    none: [],
  };

  constructor({
    level = "none",
    name = "Chopper",
    styles,
    element,
    maxContentHeight,
    maxContentWidth,
    minContentHeight = 100,
    minContentWidth = 200,
    snapThreshold,
    controlsThreshold,
    clickDetectionThreshold,
  }: LogEmitterProps) {
    // Create a new element if none is provided
    if (!element) {
      element = document.createElement("div");
      document.body.appendChild(element);
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
    this.styles = this.compileStyles({ ...CONSOLE, ...styles });

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
      text: "chopper by Protosus",
    });
    this.outputElement = this.createInternalElement({
      parent: this.element,
      type: "div",
      classNames: ["chopper-output"],
    });
    this.pinnedOutputElement = this.createInternalElement({
      parent: this.element,
      type: "div",
      classNames: ["chopper-pinned-output"],
    });
    this.logLevelElement = this.createInternalElement({
      parent: this.titleElement,
      type: "span",
      classNames: ["chopper-log-level"],
      text: this.level,
    });

    this.enableLogLevelSwitching();
  }

  private enableLogLevelSwitching() {
    // make logLevelElement clickable that changes log level
    // make the background color of the logLevelElement change based on the log level
    this.logLevelElement.addEventListener("click", () => {
      const levels = Object.keys(this.gate) as Levels[];
      const index = levels.indexOf(this.level);
      this.level = levels[(index + 1) % levels.length];
      this.logLevelElement.innerText = this.level;

      // change the background color of the logLevelElement
      this.logLevelElement.style.backgroundColor =
        LEVEL_COLORS[this.level].backgroundColor || "transparent";

      // change the color of the logLevelElement
      this.logLevelElement.style.color =
        LEVEL_COLORS[this.level].color || "black";
    });

    // assign the background color of the logLevelElement
    this.logLevelElement.style.backgroundColor =
      LEVEL_COLORS[this.level].backgroundColor || "transparent";

    // assign the color of the logLevelElement
    this.logLevelElement.style.color =
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

  setLogLevel(level: Levels) {
    this.level = level;
  }

  /**
   * Converts camel case properties of styles to kebab case to be assigned to the console CSS
   */
  private compileStyles(styles: Styles): Styles {
    const entries = Object.entries(styles) as [
      ConsoleType,
      Partial<CSSStyleDeclaration>
    ][];
    entries.forEach(([type, cssProperties]) => {
      const transformedCss = Object.entries({
        ...cssProperties,
      })
        .map(([k, v]) => `${this.toKebabCase(k)}: ${v};`)
        .join("");
      styles[type] = transformedCss as Partial<CSSStyleDeclaration>;
    });
    return styles;
  }

  /**
   * Camel case to kebab case
   */
  private toKebabCase(name: string): string {
    return name.replace(
      /[A-Z]+(?![a-z])|[A-Z]/g,
      ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()
    );
  }

  private getLogInfo(stackIndex: number): EntryInfo {
    const time = new Date().toLocaleTimeString("en-US", TIME_FORMAT);
    const stack = new Error().stack?.split("\n") || [];
    const line = stack[stackIndex]?.replace(/^\s+at\s+/, "");

    return { time, line, stack };
  }

  console(data: unknown[], type: ConsoleType, info: EntryInfo) {
    console[type](
      `%c${this.name} [${info.time}] (${type}) ${info.line}\n`,
      this.styles[type],
      ...data
    );
  }

  private render(data: unknown[], type: ConsoleType) {
    // filter out the types that are not allowed
    if (!this.gate[this.level].includes(type)) return;

    const info = this.getLogInfo(4);
    // TODO detect data types and JSON.parse the objects with indentation
    this.console(data, type, info);

    this.renderEntry(this.outputElement, data, type, info);
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }

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
    // on over it will display the stack trace
    entry.setAttribute("title", info.stack.join("\n") || "");

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
      // filter out the types that are not allowed
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
    this.render(data, "debug");
  };

  readonly $log = (...data: unknown[]) => {
    this.render(data, "log");
  };

  readonly $info = (...data: unknown[]) => {
    this.render(data, "info");
  };

  readonly $warn = (...data: unknown[]) => {
    this.render(data, "warn");
  };

  readonly $error = (...data: unknown[]) => {
    this.render(data, "error");
  };
}
