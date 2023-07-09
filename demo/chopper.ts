import Chopper from "./../src";
declare global {
  interface Window {
    chopper: boolean;
  }
}

if (!window.chopper) {
  window.chopper = true;
  const chopper = new Chopper({ name: "Chopper" });
  const chopper2 = new Chopper({ name: "Chopper2" });
  setInterval(() => {
    Math.random() > 0.9
      ? chopper.$warn("Warn level message", Date.now())
      : chopper.$log("Log level message", Date.now());

    Math.random() > 0.9
      ? chopper2.$warn("Warn level message", Date.now())
      : chopper2.$log("Log level message", Date.now());
    // Math.random() > 0.99 ? chopper.$error(Date.now()) : "";
    // Math.random() > 0.97 ? chopper.$info(Date.now()) : "";

    // pinned logs
    //   chopper.$pin.debug("Pinned debug: Hello World");
    //   chopper.$pin.log("Pinned log: Hello World");
    chopper.$pin.info("Pinned info: devtools-chopper by Protosus");
    chopper.$pin.warn("Pinned warning: Hello World");
    chopper.$pin.error("Pinned error: Hello World");
  }, 100);
}
