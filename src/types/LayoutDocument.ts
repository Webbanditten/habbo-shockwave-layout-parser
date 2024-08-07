import LayoutElement from './LayoutElement';
export interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}
interface LayoutDocument {
  name: string | null;
  date: string | null;
  version: string | null;
  elements: LayoutElement[] | null;
  rect: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  border: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  roomdata: {
    offsetx: number;
    offsety: number;
    factorx: number;
    factory: number;
    factorh: number;
  };
  clientrect: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}

export default LayoutDocument;
