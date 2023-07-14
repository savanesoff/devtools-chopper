import { screen } from "@testing-library/dom";
import "vitest-dom/extend-expect";
import Chopper from "../src";

describe("gates", () => {
  let chopper: Chopper;
  let message: string;
  beforeEach(() => {
    chopper = new Chopper({ name: "Super name", logLevel: "verbose" });
    message = Math.random().toString();
  });

  describe("none", () => {
    beforeEach(() => {
      chopper.setLogLevel("none");
    });
    it("should not print log messages", () => {
      chopper.$log(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should not print debug messages", () => {
      chopper.$debug(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should not print info messages", () => {
      chopper.$info(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should not print warn messages", () => {
      chopper.$warn(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should not print error messages", () => {
      chopper.$error(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });
  });

  describe("verbose", () => {
    it("should print log messages", () => {
      chopper.$log(message);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });

    it("should print debug messages", () => {
      chopper.$debug(message);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });

    it("should print info messages", () => {
      chopper.$info(message);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });

    it("should print warn messages", () => {
      chopper.$warn(message);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });

    it("should print error messages", () => {
      chopper.$error(message);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });
  });

  describe("info", () => {
    beforeEach(() => {
      chopper.setLogLevel("info");
    });
    it("should not print log messages", () => {
      chopper.$log(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should not print debug messages", () => {
      chopper.$debug(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should print info messages", () => {
      chopper.$info(message);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });

    it("should print warn messages", () => {
      chopper.$warn(message);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });

    it("should print error messages", () => {
      chopper.$error(message);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });
  });

  describe("warn", () => {
    beforeEach(() => {
      chopper.setLogLevel("warn");
    });
    it("should not print log messages", () => {
      chopper.$log(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should not print debug messages", () => {
      chopper.$debug(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should not print info messages", () => {
      chopper.$info(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should print warn messages", () => {
      chopper.$warn(message);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });

    it("should print error messages", () => {
      chopper.$error(message);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });
  });

  describe("error", () => {
    beforeEach(() => {
      chopper.setLogLevel("error");
    });
    it("should not print log messages", () => {
      chopper.$log(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should not print debug messages", () => {
      chopper.$debug(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should not print info messages", () => {
      chopper.$info(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should not print warn messages", () => {
      chopper.$warn(message);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    it("should print error messages", () => {
      chopper.$error(message);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });
  });
});
