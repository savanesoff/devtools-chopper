import Overdrag, { ControlProps } from "overdrag";
import { CLASSES, CONSOLE } from "./styles";

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
      className: "chopper-header",
    });
    this.titleElement = this.createInternalElement({
      parent: this.headerElement,
      type: "div",
      className: "chopper-title",
      text: this.name + ` [${this.level}]`,
    });
    this.badgeElement = this.createInternalElement({
      parent: this.headerElement,
      type: "div",
      className: "chopper-badge",
      text: "chopper by Protosus",
    });
    this.outputElement = this.createInternalElement({
      parent: this.element,
      type: "div",
      className: "chopper-output",
    });
  }

  private createInternalElement({
    parent,
    type,
    className,
    text,
  }: {
    parent: HTMLElement;
    type: string;
    className: string;
    text?: string;
  }) {
    const element = document.createElement(type);
    element.classList.add(className);
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

    // const joinedData = data.join("\n\t");
    // TODO use type for console method
    // TODO detect data types and JSON.parse the objects with indentation
    console.log(
      `%c${this.name} [${info.time}] ${info.line}\n \t${data.join("\n\t")}`,
      this.styles[type]
    );
    const entry = document.createElement("div");
    entry.classList.add(`chopper-entry`, `chopper-${type}`);
    entry.setAttribute("title", info.stack || "");
    // entry.style.display = "block";

    const details = document.createElement("div");
    details.classList.add("chopper-details");
    entry.appendChild(details);

    const time = document.createElement("span");
    time.textContent = type + "@" + info.time;
    time.classList.add("chopper-time");
    details.appendChild(time);

    const line = document.createElement("span");
    line.textContent = (info.line || "")
      .replace(location.origin, "")
      .replace(/\?t=\d+/, "");
    line.classList.add("chopper-line");
    details.appendChild(line);

    const dataText = document.createElement("pre");
    dataText.textContent = "> " + data.join("\n> ");
    dataText.classList.add("chopper-data");
    entry.appendChild(dataText);

    this.outputElement.appendChild(entry);
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
