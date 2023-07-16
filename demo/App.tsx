import { Box, Card, Divider, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useCallback, useState } from "react";
import Chopper from "./../src";
import { COLORS } from "./../src/styles";
// @eslint-ignore
declare global {
  interface Window {
    chopper: Chopper;
  }
}
if (!window.chopper) {
  window.chopper = new Chopper({ name: "Chopper Demo" });
  window.chopper.element.style.top = "auto";
  window.chopper.element.style.bottom = "0rem";
  window.chopper.element.style.left = "0rem";
  window.chopper.element.style.width = "100%";
  window.chopper.element.style.height = "50vh";
}

function App() {
  const [randomScroll, setRandomScroll] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const toggleRandomScroll = useCallback(() => {
    if (randomScroll) {
      clearInterval(randomScroll);
      setRandomScroll(null);
    } else {
      const interval = setInterval(() => {
        const random = Math.random();
        if (random > 0.95) {
          window.chopper.$error("Hello World");
        } else if (random > 0.9) {
          window.chopper.$warn("Hello World");
        } else if (random > 0.8) {
          window.chopper.$info("Hello World");
        } else if (random > 0.7) {
          window.chopper.$log("Hello World");
        } else {
          window.chopper.$debug("Hello World");
        }
      }, 100);
      setRandomScroll(interval);
    }
  }, [randomScroll]);

  const [randomPin, setRandomPin] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const toggleRandomPin = useCallback(() => {
    if (randomPin) {
      clearInterval(randomPin);
      setRandomPin(null);
    } else {
      const interval = setInterval(() => {
        const random = Math.random();
        if (random > 0.95) {
          window.chopper.$pin.error("Hello World");
        } else if (random > 0.9) {
          window.chopper.$pin.warn("Hello World");
        } else if (random > 0.8) {
          window.chopper.$pin.info("Hello World");
        } else if (random > 0.7) {
          window.chopper.$pin.log("Hello World");
        } else {
          window.chopper.$pin.debug("Hello World");
        }
      }, 100);
      setRandomPin(interval);
    }
  }, [randomPin]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          padding: "2rem",
          maxWidth: "60%",
        }}
      >
        <Typography variant="h3">devtool-chopper demo </Typography>
        <Divider sx={{ width: "100%", margin: "1rem" }} />
        <img src="https://raw.githubusercontent.com/savanesoff/protosus/main/public/icons/by-protosus.svg" />
        <Divider sx={{ width: "100%", margin: "1rem" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <a
            href="https://github.com/savanesoff/devtools-chopper"
            target="_blank"
          >
            <img src="https://badgen.net/badge/Protosus/devtools-chopper?color=purple&icon=github" />
          </a>

          <a
            href="https://github.com/savanesoff/devtools-chopper/actions/workflows/publish.yaml"
            target="_blank"
          >
            <img src="https://github.com/savanesoff/devtools-chopper/actions/workflows/publish.yaml/badge.svg?branch=main&event=push" />
          </a>

          <a href="https://badge.fury.io/js/devtools-chopper" target="_blank">
            <img src="https://badge.fury.io/js/devtools-chopper.svg" />
          </a>

          <a href="https://opensource.org/licenses/MIT" target="_blank">
            <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
          </a>

          <a href="https://www.linkedin.com/in/samvel-avanesov" target="_blank">
            <img src="https://badgen.net/badge/savanesoff/LI?color=blue" />
          </a>
        </Box>

        <Typography variant="body1">
          Chopper is a Javascript log display devtool which allows you to
          monitor application logs in DOM.
        </Typography>
        <Typography variant="body2">
          You can drag and resize the chopper window.
        </Typography>
        <Divider sx={{ width: "100%", margin: "1rem" }} />
        <Typography variant="body2">
          Open console to see styled chopper logs
        </Typography>
        <Card
          variant="elevation"
          sx={{
            gap: "1rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          <Typography variant="body2">Try scroll logs</Typography>
          <Button
            sx={COLORS.debug as any}
            variant="contained"
            onClick={() => {
              window.chopper.$debug("Hello World");
            }}
          >
            Debug
          </Button>
          <Button
            sx={COLORS.log as any}
            variant="contained"
            onClick={() => {
              window.chopper.$log("Hello World");
            }}
          >
            Log
          </Button>
          <Button
            sx={COLORS.info as any}
            variant="contained"
            onClick={() => {
              window.chopper.$info("Hello World");
            }}
          >
            Info
          </Button>

          <Button
            sx={COLORS.warn as any}
            variant="contained"
            onClick={() => {
              window.chopper.$warn("Hello World");
            }}
          >
            Warn
          </Button>
          <Button
            sx={COLORS.error as any}
            variant="contained"
            onClick={() => {
              window.chopper.$error("Hello World");
            }}
          >
            Error
          </Button>

          <Button variant="contained" onClick={toggleRandomScroll}>
            Random logs: [{randomScroll ? "Stop" : "Start"}]
          </Button>
        </Card>

        <Card
          variant="elevation"
          sx={{
            gap: "1rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          <Typography variant="body2">Try pin logs</Typography>
          <Button
            sx={COLORS.debug as any}
            variant="contained"
            onClick={() => {
              window.chopper.$pin.debug("Hello World");
            }}
          >
            Debug
          </Button>
          <Button
            sx={COLORS.log as any}
            variant="contained"
            onClick={() => {
              window.chopper.$pin.log("Hello World");
            }}
          >
            Log
          </Button>
          <Button
            sx={COLORS.info as any}
            variant="contained"
            onClick={() => {
              window.chopper.$pin.info("Hello World");
            }}
          >
            Info
          </Button>

          <Button
            sx={COLORS.warn as any}
            variant="contained"
            onClick={() => {
              window.chopper.$pin.warn("Hello World");
            }}
          >
            Warn
          </Button>
          <Button
            sx={COLORS.error as any}
            variant="contained"
            onClick={() => {
              window.chopper.$pin.error("Hello World");
            }}
          >
            Error
          </Button>

          <Button variant="contained" onClick={toggleRandomPin}>
            Random Pin: [{randomPin ? "Stop" : "Start"}]
          </Button>
        </Card>
      </div>
    </>
  );
}

export default App;
