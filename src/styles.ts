import Overdrag from "overdrag";

export type Levels = "none" | "verbose" | "info" | "warn" | "error";
export type ConsoleType = "debug" | "log" | "info" | "error" | "warn";
export type Gates = { [E in Levels]: ConsoleType[] };
export type Styles = {
  [E in ConsoleType | keyof typeof CLASSES]?: Partial<CSSStyleDeclaration>;
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
    color: "#13136b",
    backgroundColor: "skyblue",
  },
  warn: {
    color: "lightyellow",
    backgroundColor: "#ffa200",
  },
  error: {
    color: "white",
    backgroundColor: "red",
  },
};

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
};

export const CONSOLE_LAYOUT = {
  padding: "0.2rem, 0.5rem",
};

export const FONT = {
  fontFamily: "Arial, monospace",
};

export const CONSOLE = {
  debug: {
    ...COLORS.debug,
    ...CONSOLE_LAYOUT,
  },
  log: {
    ...COLORS.log,
    ...CONSOLE_LAYOUT,
  },
  info: {
    ...COLORS.info,
    ...CONSOLE_LAYOUT,
  },
  warn: {
    ...COLORS.warn,
    ...CONSOLE_LAYOUT,
    fontWeight: "bold",
  },
  error: {
    ...COLORS.error,
    ...CONSOLE_LAYOUT,
  },
};

export const ACTION_SELECTORS = {
  [Overdrag.ATTRIBUTES.OVER]: {
    opacity: "1",
  },
};

export const CLASSES = {
  container: {
    overflow: "hidden",
    width: "500px",
    height: "300px",
    backgroundColor: "transparent",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    opacity: "0.9",
    boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: "0.5rem",
    backgroundColor: "rgba(0,0,0,0.7)",
    ...FONT,
  },
  title: {
    color: "white",
    fontSize: "0.7rem",
    padding: "0.3rem 0 0.3rem 1rem",
  },
  "log-level": {
    marginLeft: "0.5rem",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: "0.2rem 0.5rem",
    fontSize: "0.6rem",
    color: "#ffeba9",
    borderRadius: "0.5rem",
    cursor: "pointer",
  },
  "log-level:hover": {
    backgroundColor: "rgba(254, 109, 6, 0.5)",
  },
  badge: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: "0 0.5rem",
    fontSize: "0.6rem",
    color: "#ffeba9",
    borderRadius: "0.5rem",
  },
  output: {
    // flexGrow: "1",
    overflowY: "scroll",
    overflowX: "hidden",
    width: "calc(100% + 1.5rem)",
  },
  "pinned-output": {
    // width: "calc(100% - 0.5rem)",
    paddingLeft: "1rem",
    position: "relative",
    boxShadow: "-1px -8px 9px 0px rgba(0,0,0,0.5)",
    backgroundColor: "rgba(0, 0, 0, 0.551)",
  },
  "pinned-output::before": {
    // width: "1rem",
    height: "inherit",
    display: "block",
    content: '"pin"',
    top: "0.5rem",
    left: "-0.0rem",
    position: "absolute",
    ...FONT,
    fontSize: "0.8rem",
    color: "rgba(255, 255, 255, 0.674)",
    // display text verticality, reading from bottom to top
    transform: "rotate(180deg)",
    writingMode: "vertical-rl",
    // textOrientation: "upright",
  },

  "pinned-output .chopper-entry::after": {
    // width: "2rem",
    // height: "inherit",
    // display: "block",
    // content: '"pin"',
    // top: "0",
    // left: "0",
    // position: "absolute",
    // // display text verticality, reading from bottom to top
    // // transform: "rotate(180deg)",
    // writingMode: "vertical-lr",
    // // borderBottom: "1px solid rgba(0, 247, 255, 1)",
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
    fontSize: "0.8rem",
    margin: "0.3rem 0",
    ...FONT,
  },
  details: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    fontSize: "0.6rem",
    opacity: "0.8",
    gap: "1rem",
    ...FONT,
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
function compileStyles(styles: Styles): Styles {
  const entries = Object.entries(styles) as [
    keyof Styles,
    Partial<CSSStyleDeclaration>
  ][];
  const newStyles = {} as Styles;
  entries.forEach(([type, cssProperties]) => {
    const transformedCss = Object.entries({
      ...cssProperties,
    })
      .map(([k, v]) => `${toKebabCase(k)}: ${v};`)
      .join("");
    newStyles[type] = transformedCss as Partial<CSSStyleDeclaration>;
  });
  return newStyles;
}

/**
 * Camel case to kebab case
 */
function toKebabCase(name: string): string {
  return name.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()
  );
}

const compiledStyles = compileStyles(CLASSES);
var style = document.createElement("style");
// style.type = 'text/css';
for (const [type, css] of Object.entries(compiledStyles)) {
  style.innerHTML += `.chopper-${type} { ${css} }`;
}

const compiledActionStyles = compileStyles(ACTION_SELECTORS);
for (const [type, css] of Object.entries(compiledActionStyles)) {
  style.innerHTML += `[${type}] { ${css} }`;
}
document.getElementsByTagName("head")[0].appendChild(style);

setTimeout(() => {
  Array.from({ length: 2 }).forEach((_, i) => {
    chopper.$debug(Date.now());
    chopper.$log(Date.now(), Date.now(), Date.now(), Date.now());
    chopper.$info("This is info message\n\tHello", CLASSES);
    chopper.$warn(Date.now());
    chopper.$error(Date.now());

    chopper.$pin.debug(Date.now());
    chopper.$pin.log(Date.now(), Date.now(), Date.now(), Date.now());
    chopper.$pin.info("This is info message\n\tHello", CLASSES);
    chopper.$pin.warn(Date.now());
    chopper.$pin.error(Date.now());
  });
}, 100);
