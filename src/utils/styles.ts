import LayoutDocument from '../types/LayoutDocument';
import LayoutElement from '../types/LayoutElement';
import assetUrl from './assetUrl';

export const getStyleTop = (element: LayoutElement) => {
  /*if(element.member.includes("door")) {
        return element.locV - element.height;
    }
    if(element.member.includes("wallpart")) {
        return element.locV - element.height;
    }
    if(element.member.includes("wallend")) {
        return element.locV - element.height;
    }
    if(element.member.includes("floor")) {
        return element.locV - (element.height/2);
    }*/
  if (element.flipV === 1) {
    return element.locV - element.height;
  }
  return element.locV;
};

export const getStyleLeft = (element: LayoutElement) => {
  /*if(element.member.includes("door")) {
        return element.locH - (element.width/2);
    }*/
  if (element.flipH === 1) {
    return element.locH - element.width;
  }
  return element.locH;
};

export const getTransform = (element: LayoutElement) => {
  let transform = '';
  if (element.flipH === 1) {
    transform += 'scaleX(-1)';
  }
  if (element.flipV === 1) {
    transform += 'scaleY(-1)';
  }
  return transform;
};

export const getBackground = (
  document: LayoutDocument,
  element: LayoutElement
) => {
  if (
    element.member === 'shadow.pixel' ||
    element.type === 'image' ||
    element.member === 'null'
  ) {
    return '';
  }
  if (element.media === 'bitmap') {
    if (
      element.active.toString() === '0' &&
      element.member !== 'leftdoor_open_mask'
    ) {
      return `url(${assetUrl(document.name + '_' + element.member, 'png')})`;
    }
    return `url(${assetUrl(element.member, 'png')})`;
  }
};

export const getBackgroundSize = (element: LayoutElement) => {
  return element.stretch === 'fixed' ? 'contain' : 'initial';
};
export const getAlignment = (element: LayoutElement) => {
  if (element.alignment === 'center') {
    return 'center';
  }
  if (element.alignment === 'left') {
    return 'flex-start';
  }
  if (element.alignment === 'right') {
    return 'flex-end';
  }
};
