import { IExtension, SaveStatus } from "@/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface InitialState {
  curGraphName: string
  saveStatus: SaveStatus
  installedExtensions: IExtension[]
  autoStart: boolean
}

const getInitialState = (): InitialState => {
  return {
    curGraphName: "",
    saveStatus: "saving",
    autoStart: false,
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
    setSaveStatus: (state, action: PayloadAction<SaveStatus>) => {
      state.saveStatus = action.payload
    },
    setAutoStart: (state, action: PayloadAction<boolean>) => {
      state.autoStart = action.payload
    },
    reset: (state) => {
      Object.assign(state, getInitialState())
    },
  },
})

export const {
  reset,
  setCurGraphName,
  setInstalledExtensions,
  setSaveStatus,
  setAutoStart,
} = globalSlice.actions

export default globalSlice.reducer
