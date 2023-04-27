import React, { useEffect, useRef } from 'react';

import { useEditor } from '@/store/editor';

const EditorImage = ({ setFill }: { setFill: CallableFunction }) => {
  const { state } = useEditor();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const adjustFillOnChanges = () => {
    if (!(imageRef && imageRef.current)) return;
    const container: [number, number] = [
      imageRef.current.clientWidth,
      imageRef.current.clientHeight,
    ];
    const natural: [number, number] = [
      imageRef.current.naturalWidth,
      imageRef.current.naturalHeight,
    ];
    const aspectRatio = ([a, b]: [number, number]) => a / b;
    if (aspectRatio(container) > aspectRatio(natural)) {
      setFill([(aspectRatio(natural) * container[1]) / container[0], 1]);
      return;
    }
    setFill([1, ((1 / aspectRatio(natural)) * container[0]) / container[1]]);
  };
  useEffect(() => {
    adjustFillOnChanges();
    window.addEventListener('resize', adjustFillOnChanges);
    return () => {
      window.removeEventListener('resize', adjustFillOnChanges);
    };
  });
  return (
    <img
      src={state.activeSrc}
      alt='Active Image'
      ref={imageRef}
      onLoad={adjustFillOnChanges}
      style={{
        transform: `scale(1)`,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        pointerEvents: 'none',
      }}
    />
  );
};

export default EditorImage;
