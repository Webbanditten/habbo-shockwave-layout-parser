import React, { CSSProperties } from "react";
import LayoutDocument from "../../types/LayoutDocument";
import LayoutElement from "../../types/LayoutElement";

interface LayoutRenderProps {
  document: LayoutDocument;
}

const assetUrl = (asset: string) => {
  return `assets/${asset}.png`;
};
const isNumber = (num: string) => {
  if (num.match(/^-?\d+$/)) {
    return true;
  } else if (num.match(/^\d+\.\d+$/)) {
    return true;
  } else {
    return false;
  }
};

const getStyleTop = (element: LayoutElement) => {
    if(element.member.includes("door")) {
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
    }
    if (element.flipV === 1) {
        return element.locV - element.height;
    }
    return element.locV;
}

const getStyleLeft = (element: LayoutElement) => {
    if(element.member.includes("door")) {
        return element.locH - (element.width/2);
    }
    if(element.flipH === 1) {
        return element.locH - element.width
    }
    return element.locH;
}
const LayoutRender = ({ document }: LayoutRenderProps) => {
  return (<>
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
            position: "absolute",
            display: (element.member.includes("mask")) ? "none" : "block",
            background:
              element.member !== "null" &&
              element.member !== "shadow.pixel" &&
              element.media === "#bitmap"
                ? `url(${assetUrl(element.member)})`
                : "",
            width: element.width,
            height: element.height,
            backgroundColor:
              element.member === "shadow.pixel"
                ? "purple"
                : element.bgColor !== "null"
                ? element.bgColor
                : "",
            left:getStyleLeft(element),
            top: getStyleTop(element),
            opacity: element.blend,
            backgroundRepeat:
              element.type === "button" || element.type !== "piece"
                ? "no-repeat"
                : "",
            fontFamily:
              element.font === "" || !isNumber(element.font)
                ? element.font
                : "Comic Sans MS",
            fontSize: element.fontSize,
            transform:
              element.flipH === 1
                ? "scaleX(-1)"
                : element.flipH === 1
                ? "scaleY(-1)"
                : "",
            color: element.txtColor,
          };

          return (
            <div aria-label={element.id} key={index} style={styles}>
              {element.type === "text" ? element.key : ""}
              {element.media === "#text" ? `--?--` : ""}
            </div>
          );
        })}
      </div>
    </div>
      <code>
        <pre style={{width: "100%", textAlign: "left"}}>{JSON.stringify(document, null, 2)}</pre>
      </code></>
  );
};

export default LayoutRender;
