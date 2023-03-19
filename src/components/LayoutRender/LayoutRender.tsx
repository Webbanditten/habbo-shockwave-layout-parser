import React, { CSSProperties, useEffect, useState } from 'react';
import LayoutDocument from '../../types/LayoutDocument';
import {
  getAlignment,
  getBackground,
  getBackgroundSize,
  getStyleLeft,
  getStyleTop,
  getTransform,
} from '../../utils/styles';
import ButtonRender from '../ButtonRender/ButtonRender';

interface LayoutRenderProps {
  document: LayoutDocument;
  externalTexts: string;
  background: string;
  debug: boolean;
}
const isNumber = (num: string) => {
  if (num.match(/^-?\d+$/)) {
    return true;
  } else if (num.match(/^\d+\.\d+$/)) {
    return true;
  } else {
    return false;
  }
};
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

const LayoutRender = ({
  document,
  background,
  externalTexts,
  debug,
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
  /*
      tWinWidth = tLayDefinition[#rect][1][3]
      tWinHeight = tLayDefinition[#rect][1][4]
  */

  const isClientRectNull = () => {
    return (
      document.clientrect.left === 0 &&
      document.clientrect.right === 0 &&
      document.clientrect.top === 0 &&
      document.clientrect.bottom === 0
    );
  };
  return (
    <>
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
            top: document.rect.top - document.clientrect.top,
            left: document.rect.left - document.clientrect.left,
            right: document.rect.right - document.clientrect.right,
            bottom: document.rect.bottom - document.clientrect.bottom,
            height: isClientRectNull() ? '100%' : document.rect.bottom,
            width: isClientRectNull() ? '100%' : document.rect.right,
          }}
        >
          {document.elements?.map((element, index) => {
            let styles: CSSProperties = {
              opacity: element.blend > 100 ? 1 : element.blend / 100,
              position: 'absolute',
              cursor:
                element.cursor === 'cursor.finger' ? 'pointer' : 'default',
              display:
                element.type !== 'button'
                  ? element.member.includes('mask') ||
                    element.member.includes('pixel.black')
                    ? 'none'
                    : 'flex'
                  : 'flex',
              background: getBackground(document, element),
              width: element.type !== 'button' ? element.width : undefined,
              height: element.type !== 'button' ? element.height : undefined,
              flexWrap: 'wrap',
              flexDirection: 'column',
              backgroundSize: getBackgroundSize(element),
              backgroundColor:
                element.member === 'shadow.pixel'
                  ? element.type === 'button'
                    ? ''
                    : 'purple'
                  : element.bgColor !== 'null'
                  ? element.bgColor
                  : 'white',
              left: getStyleLeft(element),
              top: getStyleTop(element),
              alignContent: element.alignment
                ? getAlignment(element)
                : 'center',
              textDecoration: element.fontStyle,
              backgroundRepeat:
                element.type === 'button' || element.type !== 'piece'
                  ? 'no-repeat'
                  : 'repeat',
              fontFamily:
                element.font === '' || !isNumber(element.font)
                  ? element.font
                  : 'Comic Sans MS',
              fontSize: !isNaN(element.fontSize) ? element.fontSize : '0',
              transform: getTransform(element),
              color: '#' + element.txtColor,
              textAlign:
                element.type !== 'button'
                  ? (element.alignment as
                      | 'start'
                      | 'end'
                      | 'left'
                      | 'right'
                      | 'center'
                      | 'justify'
                      | 'match-parent') ?? 'left'
                  : undefined,
            };

            return (
              <div
                aria-label={element.id}
                key={document.name + '_' + index}
                style={styles}
              >
                {element.type === 'text' ? (
                  et && et[element.key] ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: et[element.key].replaceAll('\\r', '<br />'),
                      }}
                    ></div>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
                {element.media === 'text' ? `--?--` : ''}
                {element.type === 'button' && (
                  <ButtonRender
                    parentDocument={document}
                    parentElement={element}
                    externalTexts={et}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <code
        style={{
          background: '#ccc',
          maxHeight: '520px',
          overflowX: 'hidden',
          overflowY: 'scroll',
          display: debug ? 'block' : 'none',
        }}
      >
        <pre style={{ width: '100%', textAlign: 'left' }}>
          {JSON.stringify(document, null, 2)}
        </pre>
      </code>
    </>
  );
};

export default LayoutRender;
