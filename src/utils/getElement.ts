import LayoutElement from '../types/LayoutElement';
import ElementParser from './ElementParser';

function getElement(blocks: string[]): LayoutElement {
  const elementParser = new ElementParser(blocks);
  let element: LayoutElement = {
    member: elementParser.val('member'),
    media: elementParser.val('media'),
    locX: parseInt(elementParser.val('locX')),
    locY: parseInt(elementParser.val('locY')),
    locZ: parseInt(elementParser.val('locZ')),
    locH: parseInt(elementParser.val('locH')),
    locV: parseInt(elementParser.val('locV')),
    ink: parseInt(elementParser.val('ink')),
    blend: parseInt(elementParser.val('blend')),
    width: parseInt(elementParser.val('width')),
    height: parseInt(elementParser.val('height')),
    palette: elementParser.val('palette'),
    type: elementParser.val('type'),
    id: elementParser.val('id'),
    model: elementParser.val('model'),
    key: elementParser.val('key'),
    alignment: elementParser.val('alignment'),
    fixedsize: parseInt(elementParser.val('fixedsize')),
    maxwidth: parseInt(elementParser.val('maxwidth')),
    cursor: elementParser.val('cursor'),
    font: elementParser.val('font'),
    fontSize: parseInt(elementParser.val('fontSize')),
    fontStyle: elementParser.val('fontStyle'),
    stretch: elementParser.val('strech'),
    lineHeight: parseInt(elementParser.val('lineHeight')),
    txtColor: elementParser.val('txtColor'),
    color: elementParser.val('color'),
    bgColor: elementParser.val('bgColor'),
    flipH: parseInt(elementParser.val('flipH')),
    flipV: parseInt(elementParser.val('flipV')),
    active: parseInt(elementParser.val('Active')),
    buttonProps: elementParser.parseButtonProp(),
  };
  return element;
}

export default getElement;
