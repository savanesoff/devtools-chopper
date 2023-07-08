import Chopper from "../src/index";

const element = document.createElement("div");
const chopper = new Chopper({ element, level: "verbose" });

setInterval(() => {
  Array.from({ length: 2 }).forEach((_, i) => {
    chopper.$log(Date.now());
    // chopper.$debug(Date.now());
    Math.random() > 0.9 ? chopper.$warn(Date.now()) : "";
    Math.random() > 0.99 ? chopper.$error(Date.now()) : "";
    Math.random() > 0.97 ? chopper.$info(Date.now()) : "";

    // pinned logs
    chopper.$pin.debug(Date.now());
    chopper.$pin.log(Date.now(), Date.now(), Date.now(), Date.now());
    chopper.$pin.info("This is info message\n\tHello", {
      name: "Sam",
      age: 43,
      height: 180,
    });
    chopper.$pin.warn(Date.now());
    chopper.$pin.error(Date.now());
  });
}, 10000);
