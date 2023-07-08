import Overdrag from "overdrag";
import { ConsoleType, Levels, Styles } from "./types";

const consoleLayout = {
  padding: "0.2rem, 0.5rem",
};

const fontStyle = {
  fontFamily: "Arial, monospace",
};

/**
 * @file styles.ts
 * @description Default styles for the logger
 */

export const COLORS: Record<ConsoleType, Partial<CSSStyleDeclaration>> = {
  debug: {
    color: "white",
    backgroundColor: "black",
  },
  log: {
    color: "#00f600",
    backgroundColor: "black",
  },
  info: {
    color: "#1639af",
    backgroundColor: "skyblue",
  },
  warn: {
    color: "lightyellow",
    backgroundColor: "#bc7700",
  },
  error: {
    color: "white",
    backgroundColor: "#a30202",
  },
} as const;

// styles for the log level button
export const LEVEL_COLORS: Record<Levels, Partial<CSSStyleDeclaration>> = {
  verbose: {
    ...COLORS.log,
  },
  info: {
    ...COLORS.info,
  },
  warn: {
    ...COLORS.warn,
  },
  error: {
    ...COLORS.error,
  },
  none: {
    color: "white",
    backgroundColor: "black",
  },
} as const;

// styles for the console output
export const CONSOLE_STYLE: Record<
  ConsoleType,
  Partial<CSSStyleDeclaration>
> = {
  debug: {
    ...COLORS.debug,
    ...consoleLayout,
  },
  log: {
    ...COLORS.log,
    ...consoleLayout,
  },
  info: {
    ...COLORS.info,
    ...consoleLayout,
  },
  warn: {
    ...COLORS.warn,
    ...consoleLayout,
    fontWeight: "bold",
  },
  error: {
    ...COLORS.error,
    ...consoleLayout,
  },
} as const;

export const ACTION_SELECTORS = {
  [Overdrag.ATTRIBUTES.OVER]: {
    opacity: "1",
    boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
  },
  [`[${Overdrag.ATTRIBUTES.CONTROLS}]::after`]: {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    content: "''",
    backgroundColor: "rgba(13, 255, 0, 0.898)",
  },
  [`[${Overdrag.ATTRIBUTES.CONTROLS}="bottom"]::after`]: {
    bottom: "0",
    width: "inherit",
    height: "0.4rem",
  },
  [`[${Overdrag.ATTRIBUTES.CONTROLS}="top"]::after`]: {
    top: "0",
    width: "inherit",
    height: "0.3rem",
  },
  [`[${Overdrag.ATTRIBUTES.CONTROLS}="left"]::after`]: {
    left: "0",
    height: "inherit",
    width: "0.3rem",
  },
  [`[${Overdrag.ATTRIBUTES.CONTROLS}="right"]::after`]: {
    right: "0",
    height: "inherit",
    width: "0.3rem",
  },
  [`[${Overdrag.ATTRIBUTES.CONTROLS}="left-top"]::after`]: {
    left: "0",
    height: "0.9rem",
    width: "0.9rem",
  },
  [`[${Overdrag.ATTRIBUTES.CONTROLS}="right-top"]::after`]: {
    right: "0",
    height: "0.9rem",
    width: "0.9rem",
  },
  [`[${Overdrag.ATTRIBUTES.CONTROLS}="left-bottom"]::after`]: {
    left: "0",
    bottom: "0",
    height: "0.9rem",
    width: "0.9rem",
  },
  [`[${Overdrag.ATTRIBUTES.CONTROLS}="right-bottom"]::after`]: {
    right: "0",
    bottom: "0",
    height: "0.9rem",
    width: "0.9rem",
  },
};

export const CLASSES = {
  container: {
    overflow: "hidden",
    width: "500px",
    height: "300px",
    backgroundColor: "#00000046",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    opacity: "0.9",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: "0.5rem",
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: "1",
    gap: "0.5rem",
    ...fontStyle,
  },
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "0.5rem",
    color: "white",
    fontSize: "0.7rem",
    padding: "0.3rem 0 0.3rem 1rem",
  },
  level: {
    // marginLeft: "0.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: "0.2rem 0.5rem",
    fontSize: "0.6rem",
    color: "#ffeba9",
    borderRadius: "0.5rem",
    cursor: "pointer",
  },
  status: {
    display: "flex",
    // marginLeft: "0.5rem",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.371)",
    padding: "0.2rem 0.5rem",
    fontSize: "0.6rem",
    color: "#d986ff",
    borderRadius: "0.5rem",
    textWrap: "nowrap",
  },
  "log-level:hover": {
    backgroundColor: "rgba(254, 109, 6, 0.5)",
  },
  badge: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.415)",
    padding: "0 0.5rem",
    fontSize: "0.6rem",
    color: "#ffdf77",
    borderRadius: "0.5rem",
    textWrap: "nowrap",
  },
  display: {
    display: "flex",
    flexDirection: "column",
    // flexGrow: "1",
    height: "calc(100% - 1.7rem)",
    justifyContent: "flex-end",
  },
  output: {
    // flexGrow: "1",
    overflowY: "scroll",
    overflowX: "hidden",
    width: "calc(100% + 1.5rem)",
  },
  "pinned-output": {
    paddingLeft: "1rem",
    position: "relative",
    boxShadow: "-1px -8px 9px 0px rgba(0,0,0,0.5)",
    backgroundColor: "rgba(0, 0, 0, 0.551)",
  },
  "pinned-output::before": {
    height: "inherit",
    display: "block",
    content: '"pin"',
    top: "0.5rem",
    left: "-0.0rem",
    position: "absolute",
    ...fontStyle,
    fontSize: "0.8rem",
    color: "rgba(255, 255, 255, 0.674)",
    // display text verticality, reading from bottom to top
    transform: "rotate(180deg)",
    writingMode: "vertical-rl",
  },
  entry: {
    display: "flex",
    flexDirection: "column",
    padding: "0.2rem 1rem 0rem 0.5rem",
    justifyContent: "space-between",
    alignItems: "stretch",
    borderBottom: "1px solid rgba(255,255,255,0.8)",
  },
  data: {
    display: "flex",
    fontSize: "0.7rem",
    margin: "0.3rem 0",
    ...fontStyle,
  },
  details: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    fontSize: "0.6rem",
    opacity: "0.8",
    gap: "1rem",
    ...fontStyle,
  },
  line: {
    display: "flex",
  },
  time: {
    display: "flex",
  },
  ...COLORS,
};

/**
 * Converts camel case properties of styles to kebab case to be assigned to the console CSS
 */
export function compileStyles(styles: Styles): Styles {
  const compiledStyles: Styles = {};
  for (const [type, cssProperties] of Object.entries(styles)) {
    const transformedCss = Object.entries(cssProperties)
      .map(([k, v]) => `${toKebabCase(k)}: ${v};`)
      .join("");
    compiledStyles[type] = transformedCss as Partial<CSSStyleDeclaration>;
  }
  return compiledStyles;
}

/**
 * Convert camel case to kebab case
 */
function toKebabCase(name: string): string {
  return name.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()
  );
}

function addStyles(element: HTMLStyleElement, styles: Styles, prefix = "") {
  for (const [type, css] of Object.entries(styles)) {
    element.innerHTML += `${prefix}${type} { ${css} }`;
  }
}
const style = document.createElement("style");

document.getElementsByTagName("head")[0].appendChild(style);
addStyles(style, compileStyles(CLASSES), ".chopper-");
addStyles(style, compileStyles(ACTION_SELECTORS));
