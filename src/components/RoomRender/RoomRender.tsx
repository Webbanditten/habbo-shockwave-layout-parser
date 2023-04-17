import React, { CSSProperties, useEffect, useState } from 'react';
import LayoutDocument from '../../types/LayoutDocument';
import LayoutElement from '../../types/LayoutElement';
import {
  getBackground,
  getBackgroundSize,
  getTransform,
} from '../../utils/styles';

interface LayoutRenderProps {
  document: LayoutDocument;
  externalTexts: string;
  background: string;
}
function parseText(text: string): Record<string, string> {
  let lines = text.split('\r\n');
  if (lines.length < 10) {
    lines = text.split('\n');
  }
  const result: Record<string, string> = {};
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split('=');
    const key = parts[0];
    const value = parts[1];
    if (value) {
      result[key] = value;
    }
  }
  return result;
}

const fetchExternalTexts = (externalTextsUrl: string) => {
  return fetch(externalTextsUrl).then((response) => response.text());
};

const getStyleLeft = (document: LayoutDocument, element: LayoutElement) => {
  if (element.id === 'floor') {
    return element.locH - element.width / 2;
  }

  if (element.member.includes('floor')) {
    return element.locH;
  }
  if (element.member.includes('left')) {
    if (element.member.includes('wallend')) {
      return element.locH - element.width + document.roomdata.factorh;
    }
    if (element.member.includes('wall')) {
      return element.locH - element.width + document.roomdata.factorx;
    }
  }

  if (element.member.includes('right')) {
    if (element.member.includes('wallend')) {
      return element.locH + document.roomdata.factorh;
    }
    if (element.member.includes('wall')) {
      return element.locH - element.width + document.roomdata.factorh;
    }
  }

  return element.locH + document.roomdata.offsety / 2 - element.width / 2;
};

const getStyleTop = (document: LayoutDocument, element: LayoutElement) => {
  let tElementRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  } = {
    left: 2000,
    top: 2000,
    width: -2000,
    height: -2000,
  };

  //const width = rectangle.right - rectangle.left;
  // const height = rectangle.bottom - rectangle.top;

  if (element.locH < document.rect.left) {
    tElementRect.left = element.locH;
  }
  if (element.locV > document.rect.top) {
    tElementRect.top = element.locV;
  }
  if (element.locH + element.width > document.rect.right) {
    tElementRect.width = element.locH + element.width;
  }
  if (element.locV + element.height > document.rect.bottom) {
    tElementRect.height = element.locV + element.height;
  }

  return tElementRect.top;
  if (element.id === 'floor') {
    return element.locV - document.roomdata.offsetx;
  }

  if (element.member.includes('floor')) {
    return element.locV - 1;
  }
  if (element.member.includes('left')) {
    if (element.member.includes('wallend')) {
      return element.locV - element.height + document.roomdata.factory / 2;
    }
    if (element.member.includes('wall')) {
      return element.locV - element.height + document.roomdata.factory / 2;
    }
  }

  if (element.member.includes('right')) {
    if (element.member.includes('wallend')) {
      return element.locV - element.height + document.roomdata.factory / 2;
    }
    if (element.member.includes('wall')) {
      return element.locV + document.roomdata.factory / 2 - element.height;
    }
  }

  return element.locV + element.height / 2;
};

const RoomRender = ({
  document,
  background,
  externalTexts,
}: LayoutRenderProps) => {
  const [et, setEt] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    fetchExternalTexts(externalTexts).then((data) => {
      const parsedText = parseText(data);
      setEt(parsedText);
    });
  }, [externalTexts]);
  if (et === null) {
    return <div>Loading</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          position: 'relative',
          display: 'block',
          top: 0,
          left: 0,
          width: 720,
          height: 540,
          border: '1px dashed black',
          fontSize: 10,
          background: background,
        }}
      >
        <div
          style={{
            position: 'absolute',
            overflow: 'hidden',
            top: document.clientrect.top,
            left: document.clientrect.left,
            right: document.clientrect.right,
            bottom: document.clientrect.bottom,
            height: '100%',
            width: '100%',
          }}
        >
          {document.elements?.map((element, index) => {
            let tElementRect: {
              top: number;
              left: number;
              width: number;
              height: number;
            } = {
              left: 2000,
              top: 2000,
              width: -2000,
              height: -2000,
            };

            //const width = rectangle.right - rectangle.left;
            // const height = rectangle.bottom - rectangle.top;
            const { top, left, right, bottom } = document.rect;
            const rectWidth = right - left - element.width;
            const rectHeight = bottom - top - element.height;

            const x = rectWidth - element.locH;
            const y = rectHeight - element.locV;

            tElementRect.left = x;
            tElementRect.top = y;

            let styles: CSSProperties = {
              opacity: element.blend > 100 ? 1 : element.blend / 100,
              position: 'absolute',
              cursor:
                element.cursor === 'cursor.finger' ? 'pointer' : 'default',
              background: getBackground(document, element),
              width: element.width,
              height: element.height,
              //zIndex: element.locZ,
              backgroundSize: getBackgroundSize(element),
              backgroundColor:
                element.member === 'shadow.pixel'
                  ? element.type === 'button'
                    ? ''
                    : 'purple'
                  : element.bgColor !== 'null'
                  ? element.bgColor
                  : 'white',
              left: tElementRect.left,
              top: tElementRect.top,
              backgroundRepeat: 'no-repeat',

              transform: getTransform(element),
            };

            return (
              <div
                aria-label={element.id}
                key={document.name + '_' + index}
                style={styles}
              >
                <div style={{ display: 'none' }}>
                  {JSON.stringify(tElementRect)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <code style={{ background: '#ccc', display: 'block' }}>
        <pre style={{ width: '100%', textAlign: 'left' }}>
          {JSON.stringify(
            {
              rect: document.rect,
              clientrect: document.clientrect,
              roomdata: document.roomdata,
            },
            null,
            2
          )}
          {JSON.stringify(document, null, 2)}
        </pre>
      </code>
      <br />
    </div>
  );
};

export default RoomRender;
