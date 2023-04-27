import { useEditor } from '@/store/editor'
import React from 'react'
import { motion, useAnimate, AnimatePresence } from 'framer-motion'

const EditorExporting = () => {
  const { state } = useEditor()
  return (
    <>
    <AnimatePresence>
      {state.exporting &&
        <motion.div
        initial={{ opacity: 0,}}
        animate={{ opacity: 1}}
        exit={{ opacity: 0,}}
        className='absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-20'>
          <motion.div
          initial={{ opacity: 0, y: -50}}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50}}
          className='bg-white rounded-lg p-4'>
            <div className='flex justify-center items-center'>
              <img src='/1485.gif' alt='loading' className='w-8 h-8' />
              <span className='ml-2'>Exporting...</span>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
    </>
  )
}

export default EditorExporting