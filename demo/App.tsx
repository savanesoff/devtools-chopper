import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";
import "./chopper";
// determine the environment
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - this is a global variable
const isDev = process.env.NODE_ENV === "development";
const readmePath = isDev
  ? "../README.md"
  : "https://raw.githubusercontent.com/savanesoff/devtools-chopper/main/README.md";
function App() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(readmePath)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <>
      <ReactMarkdown children={content} />
    </>
  );
}

export default App;
