import { screen } from "@testing-library/dom";
import "vitest-dom/extend-expect";
import Chopper from "./../src";
import { ControlProps } from "overdrag";
import { getRandomValue } from "./setup";

afterEach(() => {
  // Reset mock function calls
  vi.clearAllMocks();
});

describe("Constructor", () => {
  it(`should be defined`, () => {
    expect(Chopper).toBeDefined();
  });

  it("should render chopper", () => {
    new Chopper({ name: "Super name" });
    expect(screen.queryByText("Super name")).toBeInTheDocument();
  });

  it('should have log level "verbose" by default', () => {
    const chopper = new Chopper({ name: "Super name" });
    expect(chopper.getLogLevel()).toBe("verbose");
  });

  it("Should initialize super with parameters", () => {
    const element = document.createElement("div");
    globalThis.document.body.appendChild(element);
    const overdragProps: Partial<ControlProps> = {
      element,
      maxContentHeight: getRandomValue(),
      maxContentWidth: getRandomValue(),
      minContentHeight: getRandomValue(),
      minContentWidth: getRandomValue(),
      snapThreshold: getRandomValue(),
      controlsThreshold: getRandomValue(),
      clickDetectionThreshold: getRandomValue(),
    };
    const chopper = new Chopper({ name: "Super name", ...overdragProps });
    expect(chopper.element).toBe(overdragProps.element);
    expect(chopper.maxContentHeight).toBe(overdragProps.maxContentHeight);
    expect(chopper.maxContentWidth).toBe(overdragProps.maxContentWidth);
    expect(chopper.minContentHeight).toBe(overdragProps.minContentHeight);
    expect(chopper.minContentWidth).toBe(overdragProps.minContentWidth);
    expect(chopper.snapThreshold).toBe(overdragProps.snapThreshold);
    expect(chopper.controlsThreshold).toBe(overdragProps.controlsThreshold);
    expect(chopper.clickDetectionThreshold).toBe(
      overdragProps.clickDetectionThreshold
    );
  });
});

describe("APIs", () => {
  let chopper: Chopper;
  beforeEach(() => {
    chopper = new Chopper({ name: "Super name" });
  });

  describe("getLogLevel", () => {
    it("should return log level", () => {
      expect(chopper.getLogLevel()).toBe("verbose");
    });
  });

  describe("setLogLevel", () => {
    it("should set log level", () => {
      chopper.setLogLevel("error");
      expect(chopper.getLogLevel()).toBe("error");
    });
  });
});
