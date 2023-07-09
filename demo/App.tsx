import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";
import "./chopper";
function App() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("../README.md")
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
