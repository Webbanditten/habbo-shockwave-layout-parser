import LayoutDocument from "../../types/LayoutDocument";
import LayoutElement from "../../types/LayoutElement";

const transformStringToXML = (windowData: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(windowData, "text/xml");
    return xmlDoc;
  }

const getDocumentTagValue = (document: string, tag: string) => {
if(document === null) throw new Error("document is null");

const xmlDoc = transformStringToXML(document);
if(xmlDoc.getElementsByTagName(tag).length === 0) return null;

const childNodes = xmlDoc.getElementsByTagName(tag)[0].childNodes;
if(childNodes.length === 0) return null;

return xmlDoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
}

const getDocumentRect = (document: string) => {
    if(document === null) throw new Error("document is null");
    let rect = getDocumentTagValue(document, "rect");
    if(rect === null) rect = "[0,0,0,0]";
    const rectArray = rect.replace('[', '').replace(']', '').split(",");
    return {
        left: parseInt(rectArray[0]),
        top: parseInt(rectArray[1]),
        right: parseInt(rectArray[2]),
        bottom: parseInt(rectArray[3])
    }
}

const getDocumentBorder = (document: string) => {
    if(document === null) throw new Error("document is null");
    let border = getDocumentTagValue(document, "border");
    if(border === null) border = "[0,0,0,0]";
    const borderArray = border.replace('[', '').replace(']', '').split(",");
    return {
        top: parseInt(borderArray[0]),
        left: parseInt(borderArray[1]),
        right: parseInt(borderArray[2]),
        bottom: parseInt(borderArray[3])
    }
}

function getElementPropVal(arr: string[], search: string) {
    var result = "";
      arr.forEach(function(item) {
        if(item.startsWith(`#${search}:`)) {
          result = item.split(": ")[1];
      }
      
    });
    return sanitizeString(result);
  }
const sanitizeString = (string: string) => {
    return string.replaceAll('"', '');
}
const getElements = (document: string): LayoutElement[] => {
    if(document === null) throw new Error("document is null");
    const rawElements = getDocumentTagValue(document, "elements") ?? "";
    let elements: LayoutElement[] = [];

    const regex = /\[(.*?)\]/gm;
    let m;
    console.log(rawElements)
    while ((m = regex.exec(rawElements)) !== null) {

        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
        var blocks = m[1].split(", ");
        let element: LayoutElement = {
            member: (getElementPropVal(blocks, "member")),
            media: (getElementPropVal(blocks, "media")),
            locH: parseInt(getElementPropVal(blocks, "locH")),
            locV: parseInt(getElementPropVal(blocks, "locV")),
            ink: parseInt(getElementPropVal(blocks, "ink")),
            blend: parseInt(getElementPropVal(blocks, "blend")),
            width: parseInt(getElementPropVal(blocks, "width")),
            height: parseInt(getElementPropVal(blocks, "height")),
            palette: getElementPropVal(blocks, "palette"),
            type: (getElementPropVal(blocks, "type")),
            id: (getElementPropVal(blocks, "id")),
            model: getElementPropVal(blocks, "model"),
            key: (getElementPropVal(blocks, "key")),
            alignment: getElementPropVal(blocks, "alignment"),
            fixedsize: parseInt(getElementPropVal(blocks, "fixedsize")),
            maxwidth: parseInt(getElementPropVal(blocks, "maxwidth")),
            cursor: getElementPropVal(blocks, "cursor"),
            font: getElementPropVal(blocks, "font"),
            fontSize: parseInt(getElementPropVal(blocks, "fontSize")),
            fontStyle: getElementPropVal(blocks, "fontStyle"),
            stretch: getElementPropVal(blocks, "stretch"),
            lineHeight: parseInt(getElementPropVal(blocks, "lineHeight")),
            txtColor: getElementPropVal(blocks, "txtColor"),
            color: getElementPropVal(blocks, "color"),
            bgColor: getElementPropVal(blocks, "bgColor"),
            flipH: parseInt(getElementPropVal(blocks, "flipH")),
            flipV: parseInt(getElementPropVal(blocks, "flipV"))
            
        }

        elements.push(element);
        
    }
    return elements;
}


const LayoutParser = (document: string): LayoutDocument => {
    const rect = getDocumentRect(document);
    const border = getDocumentBorder(document);
    const elements = getElements(document);
    let layoutDocument: LayoutDocument = {
        version: getDocumentTagValue(document, "version"),
        name: getDocumentTagValue(document, "name"),
        date: getDocumentTagValue(document, "date"),
        elements,
        rect,
        border
    }

    return layoutDocument;
}

export default LayoutParser;
