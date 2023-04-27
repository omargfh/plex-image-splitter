import React, { useRef } from 'react';

import { exportImages } from '@/lib/export';

import Button from '@/components/buttons/Button';

import { useEditor } from '@/store/editor';

const EditorBatchApplyButton = () => {
  const { state, dispatch } = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageSrcs: string[] = [];
    if (e.target.files) {
      dispatch({ type: 'SET_EXPORTING_FLAG', payload: { exporting: true } })
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            imageSrcs.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    await new Promise((resolve) =>
      setTimeout(() => {
        if (imageSrcs.length === e.target.files?.length) {
          resolve(0);
        }
      }, 100)
    );

    const exported = await exportImages(state, imageSrcs);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(exported);
    a.download = 'export.zip';
    a.click();

    dispatch({ type: 'SET_EXPORTING_FLAG', payload: { exporting: false } })
  };

  return (
    <>
      <input
        type='file'
        accept='image/*'
        multiple
        onChange={handleImageUpload}
        className='hidden'
        ref={inputRef}
      />
      <Button onClick={() => inputRef.current?.click()}>Batch Apply</Button>
    </>
  );
};

export default EditorBatchApplyButton;
