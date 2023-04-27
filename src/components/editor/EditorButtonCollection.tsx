import React from 'react';

import Boundary from '@/components/Boundary';
import Button from '@/components/buttons/Button';
import EditorBatchApplyButton from '@/components/editor/EditorBatchApplyButton';
import EditorPresets from '@/components/editor/EditorPresets';
import EditorTools from '@/components/editor/EditorTools';
import EditorUndoRedo from '@/components/editor/EditorUndoRedo';

import { MAX_SPLITS, useEditor } from '@/store/editor';

const EditorButtonCollection = () => {
  const { state, dispatch } = useEditor();
  return (
    <>
      <Boundary />
      <Button
        onClick={() =>
          dispatch({ type: 'SUBDIVIDE_LINES', payload: { count: 1 } })
        }
        disabled={
          state.horizontalSplit.length >= MAX_SPLITS / 2 ||
          state.verticalSplit.length >= MAX_SPLITS / 2
        }
      >
        Subdivide
      </Button>
      <EditorTools />
      <div className='grid grid-cols-3 gap-2'>
        <EditorPresets />
      </div>
      <Boundary />
      <div className='grid grid-cols-3 gap-2'>
        <EditorUndoRedo />
      </div>
      <Boundary />
      <EditorBatchApplyButton />
    </>
  );
};

export default EditorButtonCollection;
