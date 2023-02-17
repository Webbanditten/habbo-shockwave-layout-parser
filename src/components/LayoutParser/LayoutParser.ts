import LayoutDocument from "../../types/LayoutDocument";
import LayoutElement from "../../types/LayoutElement";
import getElements from "../../utils/getElements";

const transformStringToXML = (windowData: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(windowData, "text/xml");
    return xmlDoc;
};

const getDocumentTagValue = (document: string, tag: string) => {
    if (document === null) throw new Error("document is null");

    const xmlDoc = transformStringToXML(document);
    if (xmlDoc.getElementsByTagName(tag).length === 0) return null;

    const childNodes = xmlDoc.getElementsByTagName(tag)[0].childNodes;
    if (childNodes.length === 0) return null;

    return xmlDoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
};

const getDocumentRect = (document: string) => {
    if (document === null) throw new Error("document is null");
    let rect = getDocumentTagValue(document, "rect");
    if (rect === null) rect = "[0,0,0,0]";
    const rectArray = rect.replace("[", "").replace("]", "").split(",");
    return {
        left: parseInt(rectArray[0]),
        top: parseInt(rectArray[1]),
        right: parseInt(rectArray[2]),
        bottom: parseInt(rectArray[3]),
    };
};

const getDocumentBorder = (document: string) => {
    if (document === null) throw new Error("document is null");
    let border = getDocumentTagValue(document, "border");
    if (border === null) border = "[0,0,0,0]";
    const borderArray = border.replace("[", "").replace("]", "").split(",");
    return {
        top: parseInt(borderArray[0]),
        left: parseInt(borderArray[1]),
        right: parseInt(borderArray[2]),
        bottom: parseInt(borderArray[3]),
    };
};

export const getElementsFromDoc = (document: string): LayoutElement[] => {
    if (document === null) throw new Error("document is null");
    const rawElements = getDocumentTagValue(document, "elements") ?? "";
    return getElements(rawElements);
};

const LayoutParser = (document: string): LayoutDocument => {
    const rect = getDocumentRect(document);
    const border = getDocumentBorder(document);
    const elements = getElementsFromDoc(document);
    let layoutDocument: LayoutDocument = {
        version: getDocumentTagValue(document, "version"),
        name: getDocumentTagValue(document, "name"),
        date: getDocumentTagValue(document, "date"),
        elements,
        rect,
        border,
    };

    return layoutDocument;
};

export default LayoutParser;
