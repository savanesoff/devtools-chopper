import Overdrag from "overdrag";
import { CLASSES, CONSOLE_STYLE, LEVEL_COLORS, compileStyles } from "./styles";
// Define time format options for Intl.DateTimeFormat
const TIME_FORMAT = {
    hour: "2-digit",
    minute: "numeric",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hourCycle: "h23",
};
// Define Chopper class
export default class Chopper extends Overdrag {
    level;
    name;
    styles;
    headerElement;
    titleElement;
    badgeElement;
    outputElement;
    logLevelElement;
    pinnedOutputElement;
    displayElement;
    statusElement;
    printToConsole;
    render = true;
    bufferSize = 100;
    bufferPausedSize = 1000;
    pinned = new Map();
    // Create pin methods for each console method
    $pin = {
        debug: (...data) => this.pin("debug", data),
        log: (...data) => this.pin("log", data),
        info: (...data) => this.pin("info", data),
        warn: (...data) => this.pin("warn", data),
        error: (...data) => this.pin("error", data),
    };
    // Define the gate object that maps log levels to allowed console methods
    gate = {
        verbose: ["debug", "log", "info", "warn", "error"],
        info: ["info", "warn", "error"],
        warn: ["warn", "error"],
        error: ["error"],
        none: [],
    };
    constructor({ console = true, level = "verbose", name, styles, element, maxContentHeight, maxContentWidth, minContentHeight = 100, minContentWidth = 200, snapThreshold, controlsThreshold, clickDetectionThreshold, }) {
        // Create a new element if none is provided
        if (!element) {
            element = document.createElement("div");
            document.body.appendChild(element);
            element.style.left = `${Math.floor(Math.random() * (window.innerWidth - parseInt(CLASSES.container.width)))}px`;
            element.style.top = `${Math.floor(Math.random() *
                (window.innerHeight - parseInt(CLASSES.container.height)))}px`;
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
    enableLogLevelSwitching() {
        // Make logLevelElement clickable that changes log level
        this.logLevelElement.addEventListener("click", () => {
            const levels = Object.keys(this.gate);
            const index = levels.indexOf(this.level);
            this.level = levels[(index + 1) % levels.length];
            this.logLevelElement.innerText = this.level;
            this.setLevelButtonColor();
        });
        this.setLevelButtonColor();
    }
    setLevelButtonColor() {
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
    createInternalElement({ parent, type, classNames, text, }) {
        const element = document.createElement(type);
        element.classList.add(...classNames);
        if (text)
            element.innerText = text;
        parent.appendChild(element);
        return element;
    }
    setupElement() {
        this.element.classList.add("chopper-container");
        this.element.style.width = CLASSES.container.width;
        this.element.style.height = CLASSES.container.height;
    }
    // Set log level
    setLogLevel(level) {
        this.level = level;
    }
    getLogInfo(stackIndex) {
        const time = new Date().toLocaleTimeString("en-US", TIME_FORMAT);
        const line = (new Error().stack?.split("\n") || [])[stackIndex]?.replace(/^\s+at\s+/, "");
        return { time, line };
    }
    console(data, type, info) {
        if (!this.printToConsole)
            return;
        console[type](`%c${this.name} [${info.time}] (${type}) ${info.line}\n`, this.styles[type], ...data);
    }
    renderOutput(data, type) {
        // Filter out the types that are not allowed
        if (!this.gate[this.level].includes(type))
            return;
        const info = this.getLogInfo(4);
        // TODO: Detect data types and JSON.parse the objects with indentation
        this.console(data, type, info);
        // If the console is paused, only render the output if the number of elements is less than the limit
        if (!this.render &&
            this.outputElement.children.length > this.bufferPausedSize) {
            return;
        }
        this.renderEntry(this.outputElement, data, type, info);
        if (!this.render)
            return;
        // Remove elements if the number of elements is greater than the limit
        while (this.outputElement.firstChild &&
            this.outputElement.children.length > this.bufferSize) {
            this.outputElement.removeChild(this.outputElement.firstChild);
        }
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
    /**
     * Render the entry to the output element
     */
    renderEntry(parent, data, type, info) {
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
    renderPinned() {
        this.pinnedOutputElement.innerHTML = "";
        this.pinned.forEach(({ data, info }, type) => {
            // Filter out the types that are not allowed
            if (!this.gate[this.level].includes(type))
                return;
            this.renderEntry(this.pinnedOutputElement, data, type, info);
        });
    }
    pin = (level, data) => {
        const info = this.getLogInfo(4);
        this.console(data, level, info);
        this.pinned.set(level, { data, info });
        this.renderPinned();
    };
    $debug = (...data) => {
        this.renderOutput(data, "debug");
    };
    $log = (...data) => {
        this.renderOutput(data, "log");
    };
    $info = (...data) => {
        this.renderOutput(data, "info");
    };
    $warn = (...data) => {
        this.renderOutput(data, "warn");
    };
    $error = (...data) => {
        this.renderOutput(data, "error");
    };
}
