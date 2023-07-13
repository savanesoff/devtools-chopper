import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import { Box, Card, Divider, Typography } from "@mui/material";
import Chopper from "./../src";
import { COLORS } from "./../src/styles";
if (!window.chopper) {
    window.chopper = new Chopper({ name: "Chopper Demo" });
    window.chopper.element.style.top = "auto";
    window.chopper.element.style.bottom = "0rem";
    window.chopper.element.style.left = "0rem";
    window.chopper.element.style.width = "100%";
    window.chopper.element.style.height = "50vh";
}
function App() {
    const [randomScroll, setRandomScroll] = useState(null);
    const toggleRandomScroll = useCallback(() => {
        if (randomScroll) {
            clearInterval(randomScroll);
            setRandomScroll(null);
        }
        else {
            const interval = setInterval(() => {
                const random = Math.random();
                if (random > 0.95) {
                    window.chopper.$error("Hello World");
                }
                else if (random > 0.9) {
                    window.chopper.$warn("Hello World");
                }
                else if (random > 0.8) {
                    window.chopper.$info("Hello World");
                }
                else if (random > 0.7) {
                    window.chopper.$log("Hello World");
                }
                else {
                    window.chopper.$debug("Hello World");
                }
            }, 100);
            setRandomScroll(interval);
        }
    }, [randomScroll]);
    const [randomPin, setRandomPin] = useState(null);
    const toggleRandomPin = useCallback(() => {
        if (randomPin) {
            clearInterval(randomPin);
            setRandomPin(null);
        }
        else {
            const interval = setInterval(() => {
                const random = Math.random();
                if (random > 0.95) {
                    window.chopper.$pin.error("Hello World");
                }
                else if (random > 0.9) {
                    window.chopper.$pin.warn("Hello World");
                }
                else if (random > 0.8) {
                    window.chopper.$pin.info("Hello World");
                }
                else if (random > 0.7) {
                    window.chopper.$pin.log("Hello World");
                }
                else {
                    window.chopper.$pin.debug("Hello World");
                }
            }, 100);
            setRandomPin(interval);
        }
    }, [randomPin]);
    return (_jsx(_Fragment, { children: _jsxs("div", { style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
                padding: "2rem",
                maxWidth: "60%",
            }, children: [_jsx(Typography, { variant: "h3", children: "devtool-chopper TS demo " }), _jsx(Divider, { sx: { width: "100%", margin: "1rem" } }), _jsx("img", { src: "https://raw.githubusercontent.com/savanesoff/protosus/main/public/icons/by-protosus.svg" }), _jsx(Divider, { sx: { width: "100%", margin: "1rem" } }), _jsxs(Box, { sx: {
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        marginBottom: "1rem",
                    }, children: [_jsx("a", { href: "https://github.com/savanesoff/devtools-chopper", target: "_blank", children: _jsx("img", { src: "https://badgen.net/badge/Protosus/devtools-chopper?color=purple&icon=github" }) }), _jsx("a", { href: "https://github.com/savanesoff/devtools-chopper/actions/workflows/publish.yaml", target: "_blank", children: _jsx("img", { src: "https://github.com/savanesoff/devtools-chopper/actions/workflows/publish.yaml/badge.svg?branch=main&event=push" }) }), _jsx("a", { href: "https://badge.fury.io/js/devtools-chopper", target: "_blank", children: _jsx("img", { src: "https://badge.fury.io/js/devtools-chopper.svg" }) }), _jsx("a", { href: "https://opensource.org/licenses/MIT", target: "_blank", children: _jsx("img", { src: "https://img.shields.io/badge/license-MIT-blue.svg" }) }), _jsx("a", { href: "(https://github.com/savanesoff/devtools-chopper", target: "_blank", children: _jsx("img", { src: "https://badgen.net/badge/savanesoff/LI?color=blue" }) })] }), _jsx(Typography, { variant: "h5", children: "Open console to see styles chopper logs" }), _jsx(Typography, { variant: "body1", children: "Chopper is a Javascript log display devtool which allows you to monitor application logs in DOM." }), _jsx(Typography, { variant: "body2", children: "You can drag and resize the chopper window." }), _jsxs(Card, { variant: "elevation", sx: {
                        gap: "1rem",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "1rem",
                        marginTop: "1rem",
                    }, children: [_jsx(Typography, { variant: "body2", children: "Try scroll logs" }), _jsx(Button, { sx: COLORS.debug, variant: "contained", onClick: () => {
                                window.chopper.$debug("Hello World");
                            }, children: "Debug" }), _jsx(Button, { sx: COLORS.log, variant: "contained", onClick: () => {
                                window.chopper.$log("Hello World");
                            }, children: "Log" }), _jsx(Button, { sx: COLORS.info, variant: "contained", onClick: () => {
                                window.chopper.$info("Hello World");
                            }, children: "Info" }), _jsx(Button, { sx: COLORS.warn, variant: "contained", onClick: () => {
                                window.chopper.$warn("Hello World");
                            }, children: "Warn" }), _jsx(Button, { sx: COLORS.error, variant: "contained", onClick: () => {
                                window.chopper.$error("Hello World");
                            }, children: "Error" }), _jsxs(Button, { variant: "contained", onClick: toggleRandomScroll, children: ["Random logs: [", randomScroll ? "Stop" : "Start", "]"] })] }), _jsxs(Card, { variant: "elevation", sx: {
                        gap: "1rem",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "1rem",
                        marginTop: "1rem",
                    }, children: [_jsx(Typography, { variant: "body2", children: "Try pin logs" }), _jsx(Button, { sx: COLORS.debug, variant: "contained", onClick: () => {
                                window.chopper.$pin.debug("Hello World");
                            }, children: "Debug" }), _jsx(Button, { sx: COLORS.log, variant: "contained", onClick: () => {
                                window.chopper.$pin.log("Hello World");
                            }, children: "Log" }), _jsx(Button, { sx: COLORS.info, variant: "contained", onClick: () => {
                                window.chopper.$pin.info("Hello World");
                            }, children: "Info" }), _jsx(Button, { sx: COLORS.warn, variant: "contained", onClick: () => {
                                window.chopper.$pin.warn("Hello World");
                            }, children: "Warn" }), _jsx(Button, { sx: COLORS.error, variant: "contained", onClick: () => {
                                window.chopper.$pin.error("Hello World");
                            }, children: "Error" }), _jsxs(Button, { variant: "contained", onClick: toggleRandomPin, children: ["Random Pin: [", randomPin ? "Stop" : "Start", "]"] })] })] }) }));
}
export default App;
