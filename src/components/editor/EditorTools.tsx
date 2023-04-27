import React, { useMemo } from 'react';

import Button from '@/components/buttons/Button';

import { MAX_SPLITS, useEditor } from '@/store/editor';

const EditorPresets = () => {
  const { state, dispatch } = useEditor();
  return (
    <>
      <div className='grid grid-cols-2 gap-2'>
        <Button
          onClick={() =>
            dispatch({
              type: 'SUBDIVIDE_LINES_HORIZONTAL',
              payload: { count: 1 },
            })
          }
          disabled={state.horizontalSplit.length >= MAX_SPLITS / 2 || !state.active || state.exporting}
        >
          H-Split
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: 'SUBDIVIDE_LINES_VERTICAL',
              payload: { count: 1 },
            })
          }
          disabled={state.verticalSplit.length >= MAX_SPLITS / 2 || !state.active || state.exporting}
        >
          V-Split
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: 'ADD_NEW_HLINE', payload: { count: 1 } })
          }
          disabled={state.horizontalSplit.length >= MAX_SPLITS || !state.active || state.exporting}
        >
          <img
            src='/images/svg/Plus.svg'
            alt='Clear'
            width={12}
            height={12}
            style={{ filter: 'invert(1)' }}
            className='mr-2'
          />{' '}
          H-Line
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: 'ADD_NEW_VLINE', payload: { count: 1 } })
          }
          disabled={state.verticalSplit.length >= MAX_SPLITS || !state.active || state.exporting}
        >
          <img
            src='/images/svg/Plus.svg'
            alt='Clear'
            width={12}
            height={12}
            style={{ filter: 'invert(1)' }}
            className='mr-2'
          />{' '}
          V-Line
        </Button>
      </div>
    </>
  );
};

export default EditorPresets;
