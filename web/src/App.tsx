import React, { useEffect } from "react";
import LayoutParser from "./components/LayoutParser/LayoutParser";
import "./App.css";
import { default as windows } from "./windows.json";
import LayoutRender from "./components/LayoutRender/LayoutRender";

function App() {
  const [windowIndex, setWindowIndex] = React.useState<number>(
    windows.windows.findIndex((window) => window === "purse.window")
  );
  const [windowData, setWindowData] = React.useState<string>("");
  useEffect(() => {
    fetch(`assets/${windows.windows[windowIndex]}`)
      .then((response) => response.text())
      .then((data) => setWindowData(data));
  }, [windowIndex]);

  const onWindowChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // parse value to number
    const value = parseInt(event.target.value);
    setWindowIndex(value);
  };

  return (
    <div className="App">
      <div>
        <select defaultValue={windowIndex} onChange={onWindowChange}>
          {windows.windows.map((window, index) => {
            return (
              <option key={index} value={index}>
                {window}
              </option>
            );
          })}
        </select>
      </div>
      <div style={{width: "100%", position: "relative"}}>{windowData && <LayoutRender document={LayoutParser(windowData)} />}</div>
    </div>
  );
}

export default App;
