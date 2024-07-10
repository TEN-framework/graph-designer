import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface InitialState {
  curGraphName: string
}

const getInitialState = (): InitialState => {
  return {
    curGraphName: ""
  }
}

export const globalSlice = createSlice({
  name: "global",
  initialState: getInitialState(),
  reducers: {
    setCurGraphName: (state, action: PayloadAction<string>) => {
      state.curGraphName = action.payload
    },
    reset: (state) => {
      Object.assign(state, getInitialState())
    },
  },
})

export const { reset, setCurGraphName } =
  globalSlice.actions

export default globalSlice.reducer
