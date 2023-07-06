import Chopper from "../src/index";

const element = document.querySelector("#chopper");
// @ts-ignore
window.chopper = new Chopper({ element, level: "verbose" });
