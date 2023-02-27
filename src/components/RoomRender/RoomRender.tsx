import React, { CSSProperties, useEffect, useState } from "react";
import LayoutDocument from "../../types/LayoutDocument";
import LayoutElement from "../../types/LayoutElement";
import {
  getBackground,
  getBackgroundSize,
  getTransform,
} from "../../utils/styles";

interface LayoutRenderProps {
  document: LayoutDocument;
  externalTexts: string;
  background: string;
}
function parseText(text: string): Record<string, string> {
  let lines = text.split("\r\n");
  if (lines.length < 10) {
    lines = text.split("\n");
  }
  const result: Record<string, string> = {};
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split("=");
    const key = parts[0];
    const value = parts[1];
    if (value) {
      result[key] = value;
    }
  }
  return result;
}

const fetchExternalTexts = (externalTextsUrl: string) => {
  return fetch(externalTextsUrl).then((response) => response.text());
};

const getStyleLeft = (document: LayoutDocument, element: LayoutElement) => {
  if (element.id === "floor") {
    return element.locH;
  }

  if (element.member.includes("floor")) {
    return element.locH;
  }
  if (element.member.includes("left")) {
    if (element.member.includes("wallend")) {
      return element.locH - element.width + document.roomdata.factorh;
    }
    if (element.member.includes("wall")) {
      return element.locH - element.width + document.roomdata.factorx;
    }
  }

  if (element.member.includes("right")) {
    if (element.member.includes("wallend")) {
      return element.locH;
    }
    if (element.member.includes("wall")) {
      return element.locH - element.width + document.roomdata.factorh;
    }
  }

  return 0;
};

const getStyleTop = (document: LayoutDocument, element: LayoutElement) => {
  if (element.id === "floor") {
    return element.locV;
  }

  if (element.member.includes("floor")) {
    return element.locV;
  }
  if (element.member.includes("left")) {
    if (element.member.includes("wallend")) {
      return (
        element.locV -
        element.height / 2 -
        document.roomdata.offsety -
        document.roomdata.factory
      );
    }
    if (element.member.includes("wall")) {
      return element.locV - document.roomdata.offsety;
    }
  }

  if (element.member.includes("right")) {
    if (element.member.includes("wallend")) {
      return element.locV;
    }
    if (element.member.includes("wall")) {
      return element.locV + document.roomdata.factory / 2 - element.height;
    }
  }

  return 0;
};

const RoomRender = ({
  document,
  background,
  externalTexts,
}: LayoutRenderProps) => {
  const [et, setEt] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    fetchExternalTexts(externalTexts).then((data) => {
      const parsedText = parseText(data);
      setEt(parsedText);
    });
  }, [externalTexts]);
  if (et === null) {
    return <div>Loading</div>;
  }
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
              background: getBackground(document, element),
              width: element.width,
              height: element.height,
              //zIndex: element.locZ,
              backgroundSize: getBackgroundSize(element),
              backgroundColor:
                element.member === "shadow.pixel"
                  ? element.type === "button"
                    ? ""
                    : "purple"
                  : element.bgColor !== "null"
                  ? element.bgColor
                  : "white",
              left: getStyleLeft(document, element),
              top: getStyleTop(document, element),
              backgroundRepeat: "no-repeat",

              transform: getTransform(element),
            };

            return (
              <div
                aria-label={element.id}
                key={document.name + "_" + index}
                style={styles}
              ></div>
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

export default RoomRender;
