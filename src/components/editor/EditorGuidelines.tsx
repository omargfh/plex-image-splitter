import React, { useRef, useState } from 'react';

import EditorLine from '@/components/editor/EditorLine';

import { SplitLine, useEditor } from '@/store/editor';

interface PropogateClickArgs {
  element: HTMLSpanElement | null;
  align: 'horizontal' | 'vertical';
  linePositionSetter: CallableFunction;
  linePosition: number;
}

const EditorGuidelines = ({ imageFill }: { imageFill: [number, number] }) => {
  const { state } = useEditor();
  const viewRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState<boolean>(false);
  const [startDistance, setStartDistance] = useState<number>(0);

  const [dragProps, setDragProps] = useState<PropogateClickArgs>({
    element: null,
    align: 'horizontal',
    linePositionSetter: () => {
      return null;
    },
    linePosition: 0,
  });

  const propogateClickFromChild = (
    e: MouseEvent,
    { element, align, linePositionSetter, linePosition }: PropogateClickArgs
  ) => {
    setDragProps({ element, align, linePositionSetter, linePosition });
    setDragging(true);
    setStartDistance(align === 'horizontal' ? e.clientY : e.clientX);
  };

  const dragBinders = {
    onMouseUp: () => {
      setDragging(false);
      setStartDistance(0);
    },
    onMouseLeave: () => {
      setDragging(false);
      setStartDistance(0);
    },
    onMouseMove: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      if (dragging) {
        if (dragProps.align === 'horizontal') {
          const delta = e.clientY - startDistance;
          const { height } = viewRef.current?.getBoundingClientRect() || {
            left: 0,
            width: 0,
          };
          const deltaPercentage = (delta / height) * 100;
          dragProps.linePositionSetter(
            dragProps.linePosition + deltaPercentage
          );
        } else if (dragProps.align === 'vertical') {
          const delta = e.clientX - startDistance;
          const { width } = viewRef.current?.getBoundingClientRect() || {
            left: 0,
            width: 0,
          };
          const deltaPercentage = (delta / width) * 100;
          dragProps.linePositionSetter(
            dragProps.linePosition + deltaPercentage
          );
        }
      }
    },
  };

  return (
    <div
      id='guidelines'
      className='relative h-full w-full'
      ref={viewRef}
      style={{
        width: `${imageFill[0] * 100}%`,
        height: `${imageFill[1] * 100}%`,
      }}
      {...dragBinders}
    >
      {state.horizontalSplit.map((line: SplitLine, i: number) => (
        <EditorLine
          line={line}
          key={`hline-${i}`}
          index={i}
          clickHandler={propogateClickFromChild}
          horizontal
        />
      ))}
      {state.verticalSplit.map((line: SplitLine, i: number) => (
        <EditorLine
          line={line}
          key={`vline-${i}`}
          index={i}
          clickHandler={propogateClickFromChild}
          vertical
        />
      ))}
    </div>
  );
};

export default EditorGuidelines;
