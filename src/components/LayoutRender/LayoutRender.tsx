import React, { CSSProperties, useEffect, useState } from "react";
import LayoutDocument from "../../types/LayoutDocument";
import LayoutElement from "../../types/LayoutElement";
import assetUrl from "../../utils/assetUrl";
import ButtonRender from "../ButtonRender/ButtonRender";

interface LayoutRenderProps {
  document: LayoutDocument;
  externalTexts: string;
  background: string;
}
const isNumber = (num: string) => {
  if (num.match(/^-?\d+$/)) {
    return true;
  } else if (num.match(/^\d+\.\d+$/)) {
    return true;
  } else {
    return false;
  }
};
function parseText(text: string): Record<string, string> {
  const lines = text.split("\r\n");
  const result: Record<string, string> = {};
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split("=");
    const key = parts[0];
    const value = parts[1];
    result[key] = value;
  }
  return result;
}

const fetchExternalTexts = (externalTextsUrl: string) => {
  return fetch(externalTextsUrl).then((response) => response.text());
};

const getStyleTop = (element: LayoutElement) => {
  /*if(element.member.includes("door")) {
        return element.locV - element.height;
    }
    if(element.member.includes("wallpart")) {
        return element.locV - element.height;
    }
    if(element.member.includes("wallend")) {
        return element.locV - element.height;
    }
    if(element.member.includes("floor")) {
        return element.locV - (element.height/2);
    }*/
  if (element.flipV === 1) {
    return element.locV - element.height;
  }
  return element.locV;
};

const getStyleLeft = (element: LayoutElement) => {
  /*if(element.member.includes("door")) {
        return element.locH - (element.width/2);
    }*/
  if (element.flipH === 1) {
    return element.locH - element.width;
  }
  return element.locH;
};

const getTransform = (element: LayoutElement) => {
  let transform = "";
  if (element.flipH === 1) {
    transform += "scaleX(-1)";
  }
  if (element.flipV === 1) {
    transform += "scaleY(-1)";
  }
  return transform;
};
const LayoutRender = ({
  document,
  background,
  externalTexts,
}: LayoutRenderProps) => {
  const [et, setEt] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    fetchExternalTexts(externalTexts).then((data) => {
      const parsedText = parseText(data);
      console.log(parsedText);
      setEt(parsedText);
    });
  }, [externalTexts]);
  return (
    <>
      <div
        style={{
          position: "relative",
          display: "block",
          top: 0,
          left: 0,
          width: 720,
          height: 540,
          border: "1px dashed black",
          fontSize: 10,
          background: background,
        }}
      >
        <div
          style={{
            position: "absolute",
            overflow: "hidden",
            top: document.rect.top,
            left: document.rect.left,
            right: document.rect.right,
            bottom: document.rect.bottom,
            height: "100%",
            width: "100%",
          }}
        >
          {document.elements?.map((element, index) => {
            let styles: CSSProperties = {
              opacity: element.blend > 100 ? 1 : element.blend / 100,
              position: "absolute",
              cursor:
                element.cursor === "cursor.finger" ? "pointer" : "default",
              display:
                element.member.includes("mask") ||
                element.member.includes("pixel.black")
                  ? "none"
                  : "block",
              background:
                element.member !== "null" &&
                element.member !== "shadow.pixel" &&
                element.media === "#bitmap"
                  ? `url(${assetUrl(element.member)})`
                  : "",
              width: element.width,
              height: element.height,
              backgroundSize:
                element.stretch === "#fixed" ? "contain" : "initial",
              backgroundColor:
                element.member === "shadow.pixel"
                  ? "purple"
                  : element.bgColor !== "null"
                  ? element.bgColor
                  : "white",
              left: getStyleLeft(element),
              top: getStyleTop(element),
              backgroundRepeat:
                element.type === "button" || element.type !== "piece"
                  ? "no-repeat"
                  : "",
              fontFamily:
                element.font === "" || !isNumber(element.font)
                  ? element.font
                  : "Comic Sans MS",
              fontSize: !isNaN(element.fontSize) ? element.fontSize : "0",
              transform: getTransform(element),
              color: element.txtColor,
            };

            return (
              <div aria-label={element.id} key={index} style={styles}>
                {element.type === "text" ? et && et[element.key] : ""}
                {element.media === "#text" ? `--?--` : ""}
                {element.type === "button" && (
                  <ButtonRender element={element} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <code style={{ background: "#ccc" }}>
        <pre style={{ width: "100%", textAlign: "left" }}>
          {JSON.stringify(document, null, 2)}
        </pre>
      </code>
    </>
  );
};

export default LayoutRender;
