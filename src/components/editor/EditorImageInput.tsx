import React, { useRef, useState } from 'react';

import Button from '@/components/buttons/Button';
import { Input } from '@/components/forms/input';

import { useEditor } from '@/store/editor';

const EditorImageInput = () => {
  const { state, dispatch } = useEditor();
  const [imageLabel, setImageLabel] = useState(state.activeSrc);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const dispatchImageFromUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (loaded) => {
        setImageLabel(file.name);
        dispatch({
          type: 'setActiveSrc',
          payload: { src: (loaded?.target?.result as string) || '' },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const tryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageLabel(e.target.value);
    fetch(e.target?.value)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: 'setActiveSrc', payload: { src: e.target.value } });
        }
      })
      .catch(() => {
        return null;
      });
  };

  return (
    <div className='grid grid-cols-4 gap-2'>
      <Input
        className='text-gray-400'
        style={{ gridColumn: '1/4' }}
        placeholder='Image URL'
        value={imageLabel}
        onChange={tryImageChange}
      />
      <input
        type='file'
        accept='image/*'
        className='hidden'
        ref={hiddenInputRef}
        onClick={(e) => {
          if (e.target) {
            e.target.value = '';
          }
        }}
        onChange={(e) => dispatchImageFromUser(e)}
      />
      <Button onClick={() => hiddenInputRef.current?.click()}>
        <img
          src='/images/svg/Image.svg'
          alt='Upload Image'
          width={20}
          height={20}
          style={{ objectFit: 'contain', filter: 'invert(1)' }}
        />
      </Button>
    </div>
  );
};

export default EditorImageInput;
