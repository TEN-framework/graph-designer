import { IExtension } from "@/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface InitialState {
  curGraphName: string,
  installedExtensions: IExtension[]
}

const getInitialState = (): InitialState => {
  return {
    curGraphName: "",
    installedExtensions: [],
  }
}

export const globalSlice = createSlice({
  name: "global",
  initialState: getInitialState(),
  reducers: {
    setCurGraphName: (state, action: PayloadAction<string>) => {
      state.curGraphName = action.payload
    },
    setInstalledExtensions: (state, action: PayloadAction<IExtension[]>) => {
      state.installedExtensions = action.payload
    },
    reset: (state) => {
      Object.assign(state, getInitialState())
    },
  },
})

export const { reset, setCurGraphName, setInstalledExtensions } =
  globalSlice.actions

export default globalSlice.reducer
