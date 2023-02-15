import React, { CSSProperties } from "react";
import LayoutDocument from "../../types/LayoutDocument";
import LayoutElement from "../../types/LayoutElement";

interface ButtonRenderProps {
  element: LayoutElement;
}

const ButtonRender = ({ element }: ButtonRenderProps) => {
  let styles: CSSProperties = {
    height: element.height,
  }

  return (
    <div aria-label={element.id} style={styles}>
      Button
    </div>
  );
};

export default ButtonRender;
