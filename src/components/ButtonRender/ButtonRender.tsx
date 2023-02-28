import { CSSProperties, useEffect, useState } from "react";
import LayoutDocument from "../../types/LayoutDocument";
import LayoutElement from "../../types/LayoutElement";
import assetUrl from "../../utils/assetUrl";
import getElements from "../../utils/getElements";

interface ButtonRenderProps {
  parentElement: LayoutElement;
  parentDocument: LayoutDocument;
  externalTexts: Record<string, string>;
}

const getButtonLayout = (element: LayoutElement) => {
  return fetch(assetUrl(`button${element.model}`, "element")).then(
    (response) => {
      return response.text();
    }
  );
};

const ButtonRender = ({
  parentElement,
  parentDocument,
  externalTexts,
}: ButtonRenderProps) => {
  const [buttonParts, setButtonParts] = useState<LayoutElement[]>();
  let styles: CSSProperties = {
    height: parentElement.height,
    width: parentElement.width,
  };

  useEffect(() => {
    getButtonLayout(parentElement).then((raw) => {
      console.log(raw);
      const parts = getElements(raw);
      if (parts && parts.length > 1) {
        setButtonParts([parts[0]]);
      }
    });
  }, [parentElement]);

  return (
    <div aria-label={parentElement.id} style={styles}>
      {buttonParts?.map((part, index) => {
        const buttonTextContent = () => {
          try {
            return externalTexts[parentElement.key].replaceAll("\\r", "<br />");
          } catch (e) {
            console.error("failed to put button content, ", parentElement.key);
            return "";
          }
        };
        console.log(part.buttonProps.text.alignment);
        const leftAsset = assetUrl(
          part.buttonProps.members.left.member ?? "",
          "png"
        );
        const middleAsset = assetUrl(
          part.buttonProps.members.middle.member ?? "",
          "png"
        );
        const rightAsset = assetUrl(
          part.buttonProps.members.right.member ?? "",
          "png"
        );
        const leftPart: CSSProperties = {
          background: `url(${leftAsset}) left top no-repeat`,
        };
        const middlePart: CSSProperties = {
          background: `url(${middleAsset}) center top repeat-x`,
          height: parentElement.height,
          maxWidth: parentElement.maxwidth,
          fontSize: part.buttonProps.text.fontSize ?? "",
          fontFamily: part.buttonProps.text.font ?? "",
          fontStyle: part.buttonProps.text.fontStyle ?? "",
          paddingTop: part.buttonProps.text.marginV ?? "",
          paddingLeft:
            part.buttonProps.text.alignment !== "center"
              ? part.buttonProps.text.marginH ?? ""
              : "",
          paddingRight:
            part.buttonProps.text.alignment !== "center"
              ? part.buttonProps.text.marginH ?? ""
              : "",
          textAlign:
            (part.buttonProps.text.alignment as
              | "start"
              | "end"
              | "left"
              | "right"
              | "center"
              | "justify"
              | "match-parent") ?? "left",
        };
        console.log(part);
        const rightPart: CSSProperties = {
          background: `url(${rightAsset}) right top no-repeat`,
          transform: part.buttonProps.members.right.cast?.includes("flipH")
            ? "scaleX(-1)"
            : "",
        };
        /*const buttonStyles: CSSProperties = {
          height: parentElement.height,
        
          maxWidth: parentElement.maxwidth,
          background: `url(${middleAsset}) center top repeat-x`,
          fontSize: part.buttonProps.text.fontSize ?? "",
          fontFamily: part.buttonProps.text.font ?? "",
          fontStyle: part.buttonProps.text.fontStyle ?? "",
          paddingTop: part.buttonProps.text.marginV ?? "",
          paddingLeft:
            part.buttonProps.text.alignment !== "center"
              ? part.buttonProps.text.marginH ?? ""
              : "",
          textAlign:
            (part.buttonProps.text.alignment as
              | "start"
              | "end"
              | "left"
              | "right"
              | "center"
              | "justify"
              | "match-parent") ?? "left",
        };*/

        const buttonStyles: CSSProperties = {
          display: "flex",
          justifyContent:
            parentElement.alignment === "right"
              ? "flex-end"
              : parentElement.alignment === "center"
              ? "center"
              : "flex-start",
          width: parentElement.width,
          height: parentElement.height,
        };

        return (
          <>
            <div style={buttonStyles}>
              <div style={leftPart}>
                <img src={leftAsset} alt="left" />
              </div>
              <div
                key={part.member + "_" + index}
                style={middlePart}
                dangerouslySetInnerHTML={{
                  __html: buttonTextContent(),
                }}
              ></div>
              <div style={rightPart}>
                <img src={rightAsset} alt="right" />
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default ButtonRender;
