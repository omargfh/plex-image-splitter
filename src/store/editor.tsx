import { exportImages } from "@/lib/export";
import React, { createContext, useReducer, useContext } from "react";

export const EditorContext = createContext( {} as any );

// Type definitions
interface SplitLine {
  position: number // 0 - 100
  size: number     // 0 - 100
}

interface Split {
  horizontalSplit: SplitLine[]
  verticalSplit: SplitLine[]
}

interface EditorState {
  activeSrc: string
  horizontalSplit: SplitLine[]
  verticalSplit: SplitLine[]
  history: {
    splits: Split[],
    offset: number
  }
  exporting: boolean
}

// Constants
export const MAX_SPLITS = 10
export const MAX_HISTORY = 30

// Initial state
const initialState: EditorState = {
  activeSrc: '',
  horizontalSplit: [],
  verticalSplit: [],
  history: {
    splits: [],
    offset: 0,
  },
  exporting: false,
}

// Actions
const setActiveSrc = (payload: string) => ({
  type: 'setActiveSrc',
  payload,
})

const setHorizontalSplit = (payload: SplitLine[]) => ({
  type: 'setHorizontalSplit',
  payload,
})

const setVerticalSplit = (payload: SplitLine[]) => ({
  type: 'setVerticalSplit',
  payload,
})

// Actions
const _subdivide = (splits: SplitLine[], count: number) => {

  splits.unshift({
    position: 0,
    size: 100,
  })
  splits.push({
    position: 100,
    size: 100,
  })

  splits = splits.flatMap((line: SplitLine, i: number) => {
    if (i === 0) {
      return []
    }
    const prevLine = splits[i - 1]
    const deltaDistance = (line.position - prevLine.position) / (count + 1)
    const size = Math.min(prevLine.size, line.size)
    const newLines = Array.from(Array(count).keys()).map((i) => {
      return {
        position: prevLine.position + deltaDistance * (i + 1),
        size
      }
    })
    return [
      ...newLines,
      line,
    ]
  }, [])
  splits.pop()
  return splits
}

const subdivide = (splits: Split, count: number) => {
  return {
    horizontalSplit: _subdivide(splits.horizontalSplit, count),
    verticalSplit: _subdivide(splits.verticalSplit, count),
  }
}


// Reducer
const reducerHelper = (state: EditorState, action: any) => {
  switch (action.type) {
    case 'setActiveSrc':
      return {
        ...state,
        activeSrc: action.payload.src,
      }
    case 'SUBDIVIDE_LINES':
      return {
        ...state,
        ...subdivide({
          horizontalSplit: [...state.horizontalSplit],
          verticalSplit: [...state.verticalSplit]
        }, action.payload.count),
      }
    case 'SUBDIVIDE_LINES_HORIZONTAL':
      return {
        ...state,
        horizontalSplit: _subdivide([...state.horizontalSplit], action.payload.count),
      }
    case 'SUBDIVIDE_LINES_VERTICAL':
      return {
        ...state,
        verticalSplit: _subdivide([...state.verticalSplit], action.payload.count),
      }
    case 'SUBDIVIDE_LINES_ITR':
      return {
        ...state,
        ...subdivide({
          horizontalSplit: [],
          verticalSplit: []
        }, action.payload.itr),
      }
    case 'SPLIT_INTO_TWO_HORIZONTAL_COMPONENTS':
      return {
        ...state,
        horizontalSplit: [{
            position: 50,
            size: 100
        }],
        verticalSplit: [],
      }
    case 'SPLIT_INTO_TWO_VERTICAL_COMPONENTS':
      return {
        ...state,
        horizontalSplit: [],
        verticalSplit: [{
            position: 50,
            size: 100
        }],
      }
    case 'CLEAR_LINES':
      return {
        ...state,
        horizontalSplit: [],
        verticalSplit: [],
      }
    case 'SET_LINE_POSITION':
      return {
        ...state,
        horizontalSplit: state.horizontalSplit.map((line: SplitLine, i: number) => {
          if (i === action.payload.index && action.payload.align === 'horizontal') {
            return {
              ...line,
              position: action.payload.position,
            }
          }
          return line
        }),
        verticalSplit: state.verticalSplit.map((line: SplitLine, i: number) => {
          if (i === action.payload.index && action.payload.align === 'vertical') {
            return {
              ...line,
              position: action.payload.position,
            }
          }
          return line
        }
      )}
      case 'ADD_NEW_HLINE':
        return {
          ...state,
          horizontalSplit: [
            ...state.horizontalSplit,
            { position: 50, size: 100 }
          ]
        }
      case 'ADD_NEW_VLINE':
        return {
          ...state,
          verticalSplit: [
            ...state.verticalSplit,
            { position: 50, size: 100 }
          ]
        }
      case 'UNDO':
        if (state.history.offset > 0) {
          const offset = state.history.offset - 1
          return {
            ...state,
            ...state.history.splits[offset],
            history: {
              ...state.history,
              offset,
            }
          }
        }
        return state
      case 'REDO':
        if (state.history.offset < state.history.splits.length - 1) {
          const offset = state.history.offset + 1
          return {
            ...state,
            ...state.history.splits[offset],
            history: {
              ...state.history,
              offset,
            }
          }
        }
        return state
      case 'PUSH_HISTORY':
        return {
          ...state,
          history: {
            ...state.history,
            splits: [
              ...state.history.splits,
              {
                horizontalSplit: [...state.horizontalSplit],
                verticalSplit: [...state.verticalSplit],
              }
            ],
            offset: state.history.splits.length,
          }
        }
      case 'EXPORT':
        setTimeout(async () => {
          let file = await exportImages(state, [state.activeSrc])
          let a = document.createElement('a')
          a.href = URL.createObjectURL(file)
          a.download = 'export.zip'
          a.click()
        }, 0);
        return state
      case 'SET_EXPORTING_FLAG':
        return {
          ...state,
          exporting: action.payload.exporting,
        }
      default:
        return state
    }
}

const reducer = (state: EditorState, action: any) => {
  const newState = reducerHelper(state, action)

  if (newState) {
    if (newState.horizontalSplit.length > MAX_SPLITS) {
      return state
    }
    if (newState.verticalSplit.length > MAX_SPLITS) {
      return state
    }
    if (newState !== state && !(['SET_LINE_POSITION', 'UNDO', 'REDO', 'PUSH_HISTORY', 'EXPORT'].includes(action.type))) {
      newState.history.splits.push({
        horizontalSplit: [...state.horizontalSplit],
        verticalSplit: [...state.verticalSplit],
      })
      if (newState.history.splits.length > MAX_HISTORY) {
        newState.history.splits.shift()
      }
      newState.history.offset = newState.history.splits.length - 1
    }
  }

  return newState
}


// Provider
export const EditorProvider = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => React.useContext(EditorContext)
export type {
  SplitLine,
  Split,
  EditorState,
}
// Path: src/store/editor.tsx