import { forwardRef } from 'react';

import { SplitLine, useEditor } from '@/store/editor';

interface EditorLineProps {
  line: SplitLine;
  horizontal?: boolean;
  vertical?: boolean;
  clickHandler: CallableFunction;
  index: number;
}

const EditorLine = forwardRef(
  ({ line, horizontal, vertical, clickHandler, index }: EditorLineProps) => {
    const { dispatch } = useEditor();

    const setLinePosition = (position: number) => {
      dispatch({
        type: 'SET_LINE_POSITION',
        payload: {
          index,
          align: horizontal ? 'horizontal' : 'vertical',
          position,
        },
      });
    };

    const dragBinders = {
      onMouseDown: (e: React.MouseEvent) => {
        clickHandler(e, {
          element: e.currentTarget,
          align: horizontal ? 'horizontal' : 'vertical',
          linePositionSetter: setLinePosition,
          linePosition: line.position,
        });
        dispatch({ type: 'PUSH_HISTORY' });
      },
    };

    const zIndex = 10;
    const lineStyle =
      'absolute bg-black rounded border border-gray-400 hover:border-gray-100';
    const dotStyle =
      'absolute w-2 h-2 bg-black border border-gray-400 rounded-full hidden';

    if (horizontal) {
      return (
        <div className='line-collection horizontal-collection'>
          <span
            className={dotStyle}
            style={{ top: `${line.position}%`, left: '1px', zIndex: zIndex }}
          ></span>
          <span
            className={dotStyle}
            style={{
              top: `${line.position}%`,
              left: `calc(${line.size}% - 7px)`,
              zIndex: zIndex,
            }}
          ></span>
          <span
            className={`h-1 cursor-ns-resize ${lineStyle}`}
            style={{
              top: `calc(${line.position}% + 2px)`,
              width: `${line.size}%`,
              zIndex: zIndex - 1,
            }}
            {...dragBinders}
          ></span>
        </div>
      );
    } else if (vertical) {
      return (
        <div className='line-collection vertical-collection'>
          <span
            className={dotStyle}
            style={{ left: `${line.position}%`, top: '1px', zIndex: zIndex }}
          ></span>
          <span
            className={dotStyle}
            style={{
              left: `${line.position}%`,
              top: `calc(${line.size}% - 7px)`,
              zIndex: zIndex,
            }}
          ></span>
          <span
            className={`w-1 cursor-ew-resize ${lineStyle}`}
            style={{
              left: `calc(${line.position}% + 2px)`,
              height: `${line.size}%`,
              zIndex: zIndex - 1,
            }}
            {...dragBinders}
          ></span>
        </div>
      );
    }
    return <></>;
  }
);

export default EditorLine;
