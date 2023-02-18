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
        const buttonStyles: CSSProperties = {
          height: parentElement.height,
          /*minWidth: parentElement.width,*/
          maxWidth: parentElement.maxwidth,
          background: `url(${leftAsset}) left top no-repeat, url(${rightAsset}) right top no-repeat, url(${middleAsset}) center top repeat-x`,
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
        };

        return (
          <div
            style={buttonStyles}
            dangerouslySetInnerHTML={{
              __html: externalTexts[parentElement.key].replaceAll(
                "\\r",
                "<br />"
              ),
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default ButtonRender;
