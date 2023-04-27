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
     {/* Editor Tools */}
      <div className='pt-4'>
        <h2 className='text-xl font-bold'>Editor Tools</h2>
        <Boundary />
      </div>
      <Button
        onClick={() => dispatch({ type: 'SUBDIVIDE_LINES', payload: { count: 1 } }) }
        disabled={
          state.horizontalSplit.length >= MAX_SPLITS / 2 ||
          state.verticalSplit.length >= MAX_SPLITS / 2 ||
          state.exporting || !state.active
        }>Subdivide</Button>
      <EditorTools />

      {/* Presets */}
      <div className='pt-4'>
        <h2 className='text-xl font-bold'>Presets</h2>
        <Boundary />
      </div>
      <div className='grid grid-cols-3 gap-2'>
        <EditorPresets />
      </div>

      {/* History & Export */}
      <div className='pt-5'>
        <h2 className='text-xl font-bold'>History & Export</h2>
        <Boundary />
      </div>
      <div className='grid grid-cols-3 gap-2'>
        <EditorUndoRedo />
      </div>
      <Boundary />
      <EditorBatchApplyButton />
    </>
  );
};

export default EditorButtonCollection;
