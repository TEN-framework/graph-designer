import { AGEventEmitter } from "../common"

export interface IExtentionEvent {
  extentionGroupChanged: (extentionName: string, extentionGroup: string) => void
}

class EventManager extends AGEventEmitter<IExtentionEvent> {
  constructor() {
    super()
  }
}

export const eventManger = new EventManager()
