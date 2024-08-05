import { CSSProperties, useEffect, useState } from 'react';
import LayoutDocument, { Rect } from '../../types/LayoutDocument';
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

const adjustRect = (tOffX: number, tOffY: number, rect: Rect): Rect => {
  return {
    left: rect.left - tOffX,
    top: rect.top - tOffY,
    right: rect.right - tOffX,
    bottom: rect.bottom - tOffY,
  };
};
const fetchExternalTexts = (externalTextsUrl: string) => {
  return fetch(externalTextsUrl).then((response) => response.text());
};

const getLeft = (document: LayoutDocument) => {
  // Shockwave lingo rect is an array of 4 values, left, top, right, bottom
  const left = 0;
  return left;
};

const getTop = (document: LayoutDocument) => {
  const top = 0;
  return top;
};

const getBottom = (document: LayoutDocument) => {
  const bottom = 0;
  return bottom;
};

const getRight = (document: LayoutDocument) => {
  const right = 0;
  return right;
};

const getStyleLeft = (document: LayoutDocument, element: LayoutElement) => {
  let left = 0;
  /*const actualRect = adjustRect(
    document.roomdata.offsetx,
    document.roomdata.offsety,
    document.rect
  );*/
  if (element.flipH !== 1) {
    if (element.member === 'leftdoor_open') {
      left = 6 - document.roomdata.factory / 2;
    }

    if (element.member === 'leftdoor_open_mask') {
      left = 6 - document.roomdata.factory / 2;
    }

    if (element.member === 'left_wallmask_0_a_0_0_0') {
      left = -element.width / 2 + 2 - document.roomdata.factory / 2;
    }

    if (element.member === 'left_wallpart_0_a_0_0_0') {
      left = -element.width / 2 - document.roomdata.factory / 2;
    }

    if (element.member === 'right_wallpart_0_a_0_2_0') {
      left = element.width / 2 - document.roomdata.factory / 2;
    }

    if (element.member === 'flat_floor_0_a_0_0_0') {
      left = 0;
    }

    if (element.member === 'left_wallend_0_b_0_0_0') {
      left = -element.width - document.roomdata.factory / 2 - 2;
    }

    if (element.member === 'right_wallend_0_b_0_2_0') {
      left = element.width - document.roomdata.factory - 7;
    }
    if (element.member === 'left_wallpart2_0_a_0_0_0') {
      left = -element.width;
    }

    if (element.member === 'right_stairs2_0_a_0_2_0') {
      left = 0;
    }
    if (element.member === 'right_stairs1_0_a_0_2_0') {
      left = 0;
    }
    if (element.member === 'right_wallend2_0_b_0_2_0') {
      left = element.width / 2 - document.roomdata.factory - 3;
    }
  } else {
    left = element.width;
    if (element.member === 'flat_floor_0_a_0_0_0') {
      left = element.width;
    }
  }

  return -left;
};

const getStyleTop = (document: LayoutDocument, element: LayoutElement) => {
  let top = 0;
  const actualRect = adjustRect(
    document.roomdata.offsetx,
    document.roomdata.offsety,
    document.rect
  );
  if (element.flipH !== 1) {
    if (element.member === 'right_wallend2_0_b_0_2_0') {
      top = element.height - document.roomdata.factory / 2 + -5;
    }
    if (element.member === 'right_wallpart2_0_a_0_2_0') {
      top = element.height - 16;
    }

    if (element.member === 'flat_stair_0_a_0_0_0') {
      top = 1;
    }

    if (element.member === 'left_wallpart2_0_a_0_0_0') {
      top = element.height - 16;
    }

    if (element.member === 'right_stairs2_0_a_0_2_0') {
      top = element.height - 16;
    }
    if (element.member === 'right_stairs1_0_a_0_2_0') {
      top = element.height - 32;
    }

    if (element.member === 'leftdoor_open') {
      top = element.height - 4 - document.roomdata.factory / 2;
    }

    if (element.member === 'leftdoor_open_mask') {
      top = element.height - 4 - document.roomdata.factory / 2;
    }
    if (element.member === 'left_wallmask_0_a_0_0_0') {
      top = element.height - document.roomdata.factory / 2;
    }

    if (element.member === 'left_wallpart_0_a_0_0_0') {
      top = element.height - document.roomdata.factory / 2;
    }

    if (element.member === 'right_wallpart_0_a_0_2_0') {
      top = element.height - document.roomdata.factory / 2;
    }

    if (element.member === 'flat_floor_0_a_0_0_0') {
      top = 1;
    }

    if (element.member === 'left_wallend_0_b_0_0_0') {
      top = element.height - 22;
    }

    if (element.member === 'right_wallend_0_b_0_2_0') {
      top = element.height - 21;
    }
  } else {
    top = 1;
  }
  return -top;
};

const getStyleBottom = (document: LayoutDocument, element: LayoutElement) => {
  const actualRect = adjustRect(
    document.roomdata.offsetx,
    document.roomdata.offsety,
    document.rect
  );
  const bottom = 0;
  return bottom;
};

const getStyleRight = (document: LayoutDocument, element: LayoutElement) => {
  const actualRect = adjustRect(
    document.roomdata.offsetx,
    document.roomdata.offsety,
    document.rect
  );
  const right = 0;
  return -right;
};

const getZIndex = (element: LayoutElement, index: number) => {
  if (element.member === 'left_wallend_0_b_0_0_0') {
    return 1000;
  }

  if (element.member === 'right_wallend_0_b_0_2_0') {
    return 1000;
  }
  // Reverse index so that the last element is on top
  return index;
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
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            height: '100%', //document.rect.bottom + 'px',
            width: '100%', //document.rect.right + 'px',
            left: getLeft(document),
            top: getTop(document),
            right: getRight(document),
            bottom: getBottom(document),
          }}
        >
          {document.elements?.map((element, index) => {
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
              left: element.locH,
              top: element.locV,
              marginLeft: getStyleLeft(document, element),
              marginTop: getStyleTop(document, element),
              marginRight: getStyleRight(document, element),
              marginBottom: getStyleBottom(document, element),
              backgroundRepeat: 'no-repeat',
              zIndex: getZIndex(element, index),
              transform: getTransform(element),
            };

            return (
              <div
                draggable={true}
                aria-label={element.id}
                key={document.name + '_' + index}
                style={styles}
              ></div>
            );
          })}
        </div>
      </div>
      <code style={{ background: '#ccc', display: 'none' }}>
        <pre style={{ width: '100%', textAlign: 'left' }}>
          {JSON.stringify(document, null, 2)}
        </pre>
      </code>
    </>
  );
};

export default RoomRender;
