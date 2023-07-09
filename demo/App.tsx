import { useState } from "react";
import "./App.css";
import "./chopper";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>devtools-chopper</h1>
      <p>
        Chopper is a simple, fast and flexible log control tool designed display
        logs in browser window with various filters, drag and resize
        capabilities.
      </p>
      <div></div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
