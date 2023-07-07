import Overdrag, { ControlProps } from "overdrag";
import { CLASSES, CONSOLE, LEVEL_COLORS } from "./styles";

/** log levels available*/
export type Levels = "none" | "verbose" | "info" | "warn" | "error";
/** io methods */
export type ConsoleType = "debug" | "log" | "info" | "error" | "warn";
export type Gates = { [E in Levels]: ConsoleType[] };
export type Styles = { [E in ConsoleType]?: Partial<CSSStyleDeclaration> };

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

  // private buffer: { level: Levels; out: string }[] = [];
  // readonly bufferLength = 10;

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

  private getLogInfo(stackIndex: number): {
    line: string | undefined;
    time: string;
    stack: string | undefined;
  } {
    const time = new Date().toLocaleTimeString("en-US", TIME_FORMAT);
    const stack = new Error().stack?.split("\n")[stackIndex];
    const line = stack?.replace(/^\s+at\s+/, "");

    return { time, line, stack };
  }

  private render(type: ConsoleType, data: unknown[]) {
    const info = this.getLogInfo(4);

    if (!this.gate[this.level].includes(type)) return;
    // TODO detect data types and JSON.parse the objects with indentation
    console[type](
      `%c${this.name} [${info.time}] ${info.line}\n \t${data.join("\n\t")}`,
      this.styles[type]
    );

    this.renderEntry(type, info, data);
  }

  renderEntry(
    type: ConsoleType,
    info: {
      line: string | undefined;
      time: string;
      stack: string | undefined;
    },
    data: unknown[]
  ) {
    const entry = this.createInternalElement({
      parent: this.outputElement,
      type: "div",
      classNames: [`chopper-entry`, `chopper-${type}`],
    });
    // on over it will display the stack trace
    entry.setAttribute("title", info.stack || "");

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
      text: `${info.line}`,
    });

    this.createInternalElement({
      parent: entry,
      type: "pre",
      classNames: ["chopper-data"],
      text: "> " + data.join("\n> "),
    });

    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }

  readonly $debug = (...data: unknown[]) => {
    this.render("debug", data);
  };

  readonly $log = (...data: unknown[]) => {
    this.render("log", data);
  };

  readonly $info = (...data: unknown[]) => {
    this.render("info", data);
  };

  readonly $warn = (...data: unknown[]) => {
    this.render("warn", data);
  };

  readonly $error = (...data: unknown[]) => {
    this.render("error", data);
  };
}
