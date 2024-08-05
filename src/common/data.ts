export class EditorData {
  // extensionGroup =>  {
  //  [extensionName]: nodeId
  // }
  nodeMap: Map<string, { [extensionName: string]: string }> = new Map()
  nodeId: number = 1
  edgeId: number = 1

  constructor() { }

  genEdgeId() {
    return `${this.edgeId++}`
  }

  genNodeId() {
    return `${this.nodeId++}`
  }

  getNodeId(extensionGroup: string, extensionname: string) {
    let data = this.nodeMap.get(extensionGroup)
    if (data) {
      if (!data[extensionname]) {
        throw new Error(
          `Invalid extension Node: ${extensionname}, not found in extensionGroup: ${extensionGroup}`,
        )
      }
      return data[extensionname]
    }
    throw new Error(
      `Invalid extensionGroup: ${extensionGroup}, not found in nodeMap`,
    )
  }

  delNode(extensionGroup: string, extensionname: string) {
    let data = this.nodeMap.get(extensionGroup)
    if (data) {
      delete data[extensionname]
    }
  }

  saveNodeId(extensionGroup: string, extensionname: string, nodeId: string) {
    let data = this.nodeMap.get(extensionGroup)
    if (!data) {
      data = {}
      this.nodeMap.set(extensionGroup, data)
    }
    data[extensionname] = nodeId
  }

  clear() {
    this.nodeMap.clear()
    this.nodeId = 1
    this.edgeId = 1
  }
}


export const editorData = new EditorData()

if (process.env.NODE_ENV === "development") {
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.editorData = editorData
  }
}
