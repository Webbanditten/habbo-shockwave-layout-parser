import LayoutElement from "./LayoutElement";

interface LayoutDocument {
    name: string | null;
    date: string | null;
    version: string | null;
    elements: LayoutElement[] | null;
    rect: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    },
    border: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    }
}

export default LayoutDocument;
