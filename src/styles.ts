import Overdrag from "overdrag";
/**
 * @file styles.ts
 * @description Default styles for the logger
 */

export const COLORS = {
  debug: {
    color: "white",
    backgroundColor: "black",
  },
  log: {
    color: "green",
    backgroundColor: "black",
  },
  info: {
    color: "#13136b",
    backgroundColor: "skyblue",
  },
  warn: {
    color: "lightyellow",
    backgroundColor: "#ff7c00",
  },
  error: {
    color: "white",
    backgroundColor: "red",
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
    backgroundColor: "rgba(255,0,0,0.5)",
    flexGrow: "1",
    overflowY: "scroll",
    overflowX: "hidden",
    width: "calc(100% + 1.5rem)",
  },
  entry: {
    display: "flex",
    flexDirection: "column",
    padding: "0.2rem 1rem 0rem 0.5rem",
    justifyContent: "space-between",
    alignItems: "stretch",
    borderBottom: "1px solid rgba(255,255,255,0.4)",
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
    fontSize: "0.8rem",
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

export type Levels = "none" | "verbose" | "info" | "warn" | "error";
export type ConsoleType = "debug" | "log" | "info" | "error" | "warn";
export type Gates = { [E in Levels]: ConsoleType[] };
export type Styles = {
  [E in ConsoleType | keyof typeof CLASSES]?: Partial<CSSStyleDeclaration>;
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
    chopper.$log(Date.now(), Date.now(), Date.now(), Date.now());
    chopper.$info("This is info message", JSON.stringify(CLASSES, null, 2));
    chopper.$warn(Date.now());
    chopper.$error(Date.now());
  });
}, 100);
