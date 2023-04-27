import React from 'react';

import Button from '@/components/buttons/Button';

import { useEditor } from '@/store/editor';

const EditorPresets = () => {
  const { state, dispatch } = useEditor();
  const [canRedo, canUndo] = [
    state.history.splits.length > 0 &&
      state.history.offset < state.history.splits.length - 1,
    state.history.splits.length > 0 && state.history.offset >= 0,
  ];
  return (
    <>
      <Button onClick={() => dispatch({ type: 'UNDO' })} disabled={!canUndo || !state.active || state.exporting}>
        <img
          src='/images/svg/Undo.svg'
          alt='Clear'
          width={20}
          height={20}
          style={{ filter: 'invert(1)' }}
        />
      </Button>
      <Button onClick={() => dispatch({ type: 'REDO' })} disabled={!canRedo || !state.active || state.exporting}>
        <img
          src='/images/svg/Redo.svg'
          alt='Clear'
          width={20}
          height={20}
          style={{ filter: 'invert(1)' }}
        />
      </Button>
      <Button onClick={() => dispatch({ type: 'EXPORT' })} disabled={!state.active || state.exporting}>
        <img
          src='/images/svg/Export.svg'
          alt='Clear'
          width={20}
          height={20}
          style={{ filter: 'invert(1)' }}
        />
      </Button>
    </>
  );
};

export default EditorPresets;
