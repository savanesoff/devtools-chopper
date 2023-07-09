import "vitest-dom/extend-expect";
import Chopper from "./../src";

function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

/**
 * Mock HTMLElement.offsetParent as it is not supported in JEST DOM
 */
Object.defineProperty(HTMLElement.prototype, "offsetParent", {
  get() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let element = this;
    while (
      !isNullOrUndefined(element) &&
      (isNullOrUndefined(element.style) ||
        isNullOrUndefined(element.style.display) ||
        element.style.display.toLowerCase() !== "none")
    ) {
      element = element.parentNode;
    }

    if (!isNullOrUndefined(element)) {
      return null;
    }

    if (
      !isNullOrUndefined(this.style) &&
      !isNullOrUndefined(this.style.position) &&
      this.style.position.toLowerCase() === "fixed"
    ) {
      return null;
    }

    if (
      this.tagName.toLowerCase() === "html" ||
      this.tagName.toLowerCase() === "body"
    ) {
      return null;
    }

    return this.parentNode;
  },
});

export function getRandomValue(min = 0, max = 50) {
  return min + Math.round(Math.random() * (max - min));
}

export function getRandomPixelValue(min = 0, max = 50) {
  return `${getRandomValue(min, max)}px`;
}

describe("Constructor", () => {
  afterEach(() => {
    // Reset mock function calls
    vi.clearAllMocks();
  });

  it(`Should be defined`, () => {
    expect(Chopper).toBeDefined();
  });
});
