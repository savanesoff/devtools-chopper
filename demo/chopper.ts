import Chopper from "./../src";
declare global {
  interface Window {
    chopper: HTMLDivElement;
    chopperLogger: Chopper;
  }
}
window.chopper = window.chopper || document.createElement("div");
document.body.appendChild(window.chopper);
window.chopperLogger =
  window.chopperLogger ||
  new Chopper({ element: window.chopper, level: "verbose" });

setInterval(() => {
  Array.from({ length: 2 }).forEach((_, i) => {
    window.chopperLogger.$log(Date.now());
    // window.chopperLogger.$debug(Date.now());
    Math.random() > 0.9 ? window.chopperLogger.$warn(Date.now()) : "";
    Math.random() > 0.99 ? window.chopperLogger.$error(Date.now()) : "";
    Math.random() > 0.97 ? window.chopperLogger.$info(Date.now()) : "";

    // pinned logs
    window.chopperLogger.$pin.debug(Date.now());
    window.chopperLogger.$pin.log(
      Date.now(),
      Date.now(),
      Date.now(),
      Date.now()
    );
    window.chopperLogger.$pin.info("This is info message\n\tHello", {
      name: "Sam",
      age: 43,
      height: 180,
    });
    window.chopperLogger.$pin.warn(Date.now());
    window.chopperLogger.$pin.error(Date.now());
  });
}, 100);
