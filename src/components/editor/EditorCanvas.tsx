import React, { useState } from 'react';

import EditorGuidelines from '@/components/editor/EditorGuidelines';
import EditorImage from '@/components/editor/EditorImage';

const EditorCanvas = () => {
  const [imageFill, setImageFill] = useState<[number, number]>([1, 1]); // h, w
  return (
    <div
      className='relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-200'
      style={{
        background: '#111',
        backgroundImage:
          'linear-gradient(rgba(100, 100, 100, .7) .05em, transparent .05em), linear-gradient(90deg, rgba(100,100,100, .7) .05em, transparent .05em)',
        backgroundSize: '1.5em 1.5em',
        backgroundPosition: 'center',
      }}
    >
      <EditorGuidelines imageFill={imageFill} />
      <EditorImage setFill={setImageFill} />
    </div>
  );
};

export default EditorCanvas;
