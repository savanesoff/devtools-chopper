import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import "README.md";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";
import "./chopper";
function App() {
    const [content, setContent] = useState("");
    useEffect(() => {
        fetch("README.md", { mode: "no-cors" })
            .then((res) => res.text())
            .then((text) => setContent(text));
    }, []);
    return (_jsx(_Fragment, { children: _jsx(ReactMarkdown, { children: content }) }));
}
export default App;
