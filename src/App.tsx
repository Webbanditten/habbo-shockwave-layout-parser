import React, { useEffect } from "react";
import LayoutParser from "./components/LayoutParser/LayoutParser";
import "./App.css";
import { default as windows } from "./windows.json";
import LayoutRender from "./components/LayoutRender/LayoutRender";
import RoomRender from "./components/RoomRender/RoomRender";

function App() {
  const [windowIndex, setWindowIndex] = React.useState<number>(
    windows.windows.findIndex((window) => window === "purse.window")
  );
  const [background, setBackground] = React.useState<string>("#ffffff");
  const [externalTexts, setExternalTexts] =
    React.useState<string>("./texts/dk.txt");
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
    <div className="App" style={{ display: "flex", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignContent: "flex-start" }}>
        <label htmlFor="background">Background</label>
        <input
          onChange={(e) => setBackground(e.currentTarget.value)}
          name="background"
          type="text"
          value={background}
        />
        <label htmlFor="external_texts">External Texts</label>
        <input
          onChange={(e) => setExternalTexts(e.currentTarget.value)}
          name="external_texts"
          type="text"
          value={externalTexts}
        />
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
      <div style={{ width: "100%", position: "relative", display: "flex" }}>
        {windowData &&
          (!windows.windows[windowIndex].includes(".room") ? (
            <LayoutRender
              externalTexts={externalTexts}
              background={background}
              document={LayoutParser(windowData)}
            />
          ) : (
            <RoomRender
              externalTexts={externalTexts}
              background={background}
              document={LayoutParser(windowData)}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
