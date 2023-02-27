export interface ButtonProps {
  state: string | null;
  members: {
    left: {
      member: string | null;
      cast: string | null;
    };
    right: {
      member: string | null;
      cast: string | null;
    };
    middle: {
      member: string | null;
      cast: string | null;
    };
  };
  text: {
    font: string | null;
    fontSize: number | null;
    fontStyle: string | null;
    alignment: string | null;
    color: string | null;
    bgColor: string | null;
    boxType: string | null;
    marginH: number | null;
    marginV: number | null;
  };
}
interface LayoutElement {
  member: string;
  media: string;
  locH: number;
  locV: number;
  locZ: number;
  ink: number;
  blend: number;
  width: number;
  height: number;
  palette: string;
  type: string;
  id: string;
  model: string;
  key: string;
  alignment: string;
  maxwidth: number;
  fixedsize: number;
  cursor: string;
  font: string;
  fontSize: number;
  fontStyle: string;
  stretch: string;
  lineHeight: number;
  txtColor: string;
  color: string;
  bgColor: string;
  flipH: number;
  flipV: number;
  active: number;
  buttonProps: ButtonProps;
}

export default LayoutElement;
