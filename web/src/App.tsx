import React, { useEffect } from 'react';
import LayoutParser from './components/LayoutParser/LayoutParser';
import './App.css';
import {default as windows} from './windows.json';

function App() {
  const [windowIndex, setWindowIndex] = React.useState<number>(windows.windows.findIndex((window) => window === 'error.window'));
  const [windowData, setWindowData] = React.useState<string>("");
  useEffect(() => {
    fetch(`assets/${windows.windows[windowIndex]}`)
      .then(response => response.text())
      .then(data => setWindowData(data));
  }, [windowIndex]);

  const onWindowChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // parse value to number
    const value = parseInt(event.target.value);
    setWindowIndex(value); 
  }

  const getWindowDataAsXML = (windowData: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(windowData, "text/xml");
    return xmlDoc;
  }

  const getLayoutElements = (windowData: string) => {
    if(windowData === null) throw new Error("windowData is null");
    return getWindowDataAsXML(windowData).getElementsByTagName("elements")[0].childNodes[0].nodeValue;
  }

  return (
    <div className="App">
      <select defaultValue={windowIndex} onChange={onWindowChange}>
        {windows.windows.map((window, index) => {
          return <option key={index} value={index}>{window}</option>
        })}
      </select>
      
      {windowData && <LayoutParser elements={getLayoutElements(windowData)} />}

    </div>
  );
}

export default App;
