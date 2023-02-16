import LayoutElement from "../types/LayoutElement";
import getElement from "./getElement";

function getElements(rawElements: string): LayoutElement[] {
  let elements: LayoutElement[] = [];
  let m;
  const regex = /\[(.*?)\]/gm;
  while ((m = regex.exec(rawElements)) !== null) {

      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }
      
      // The result can be accessed through the `m`-variable.
      var blocks = m[1].split(", ");
      const element = getElement(blocks);

      elements.push(element);
      
  }
  return elements;
}

export default getElements;
