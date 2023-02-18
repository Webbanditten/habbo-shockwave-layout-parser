import LayoutElement from "../types/LayoutElement";
import getElement from "./getElement";

function getElements(rawElements: string): LayoutElement[] {
  let elements: LayoutElement[] = [];
  let separatedElements = rawElements.replace(/\n|\r|\t/g, "");
  separatedElements = separatedElements.substring(
    1,
    separatedElements.length - 1
  );

  separatedElements.split("][").forEach((element) => {
    console.log(element);
    let sanitizedElement = element.trim();
    /*sanitizedElement = sanitizedElement.substring(
      1,
      sanitizedElement.length - 1
    );*/
    elements.push(getElement(sanitizedElement.split(", ")));
  });

  return elements;
  /*
  let elements: LayoutElement[] = [];
  let m;
  const regex = /\[([^[\]]|\[(?:(?!\]).)*\])*\](?=[^[]*\])/g;
  while ((m = regex.exec(rawElements)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    console.log(m);
    var blocks = m[1].split(", ");
    const element = getElement(blocks);

    elements.push(element);
  }
  return elements;*/
}

export default getElements;
