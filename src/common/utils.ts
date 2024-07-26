import { Edge, Node, XYPosition, Position } from "@xyflow/react"
import {
  IExtension,
  IConnection,
  IConnectionData,
  MsgType,
  InOutData,
  IExtensionNode,
} from "@/types"
import { DEFAULT_APP, DEFAULT_EXTENTION_GROUP } from "./constant"
import { logger } from "./logger"

// extensionGroup =>  {
//  [extensionName]: nodeId
// }
let nodeMap = new Map<string, { [extensionName: string]: string }>()

// @ts-ignore
window.nodeMap = nodeMap

let EDGE_ID = 0
let NODE_ID = 0

const genEdgeId = () => {
  return `${EDGE_ID++}`
}

const genNodeId = () => {
  return `${NODE_ID++}`
}

function _pad(num: number) {
  return num.toString().padStart(2, "0")
}

export const formatTime = (date?: Date) => {
  if (!date) {
    date = new Date()
  }
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()

  return `${_pad(hours)}:${_pad(minutes)}:${_pad(seconds)}:${_pad(milliseconds)}`
}

export const round = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}



// DataTest => data_test
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase()).slice(1)
}

export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ----------------------- graph ---------------------
export const getNodeId = (extensionGroup: string, extensionname: string) => {
  let data = nodeMap.get(extensionGroup)
  if (data) {
    return data[extensionname]
  }
  throw new Error(`Invalid extension: ${extensionname}, not found in nodeMap`)
}

export const delNodeId = (extensionGroup: string, extensionname: string) => {
  let data = nodeMap.get(extensionGroup)
  if (data) {
    delete data[extensionname]
  }
}

export const saveNodeId = (extensionGroup: string, extensionname: string, nodeId: string) => {
  let data = nodeMap.get(extensionGroup)
  if (!data) {
    data = {}
    nodeMap.set(extensionGroup, data)
  }
  data[extensionname] = nodeId
}

export const extensionsToNodes = (
  extensions: IExtension[],
): IExtensionNode[] => {
  return extensions.map((extension, index) => {
    const position = {
      x: index * 250,
      y: (index % 2 == 0 ? 1 : -1) * 100 + round(-130, 130),
    }
    return extensionToNode(extension, { position })
  })
}

export const extensionToNode = (
  extension: IExtension,
  property: {
    position: XYPosition
  },
): IExtensionNode => {
  const { position } = property
  const inputs: InOutData[] = []
  const outputs: InOutData[] = []
  const { api, extension_group, name, addon } = extension
  if (api?.cmd_in) {
    api.cmd_in.forEach((input) => {
      inputs.push({ name: input.name, type: "cmd", status: "default" })
    })
  }
  if (api?.cmd_out) {
    api.cmd_out.forEach((output) => {
      outputs.push({ name: output.name, type: "cmd", status: "default" })
    })
  }
  if (api?.data_in) {
    api.data_in.forEach((input) => {
      inputs.push({ name: input.name, type: "data", status: "default" })
    })
  }
  if (api?.data_out) {
    api.data_out.forEach((output) => {
      outputs.push({ name: output.name, type: "data", status: "default" })
    })
  }
  if (api?.pcm_frame_in) {
    api.pcm_frame_in.forEach((input) => {
      inputs.push({ name: input.name, type: "pcm_frame", status: "default" })
    })
  }
  if (api?.pcm_frame_out) {
    api.pcm_frame_out.forEach((output) => {
      outputs.push({ name: output.name, type: "pcm_frame", status: "default" })
    })
  }
  if (api?.img_frame_in) {
    api.img_frame_in.forEach((input) => {
      inputs.push({ name: input.name, type: "img_frame", status: "default" })
    })
  }
  if (api?.img_frame_out) {
    api.img_frame_out.forEach((output) => {
      outputs.push({ name: output.name, type: "img_frame", status: "default" })
    })
  }

  const id = genNodeId()
  saveNodeId(extension_group, name, id)

  return {
    id: id,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: position,
    type: "extension",
    data: {
      status: "default",
      addon: addon,
      name: name,
      inputs: inputs,
      outputs: outputs,
      extensionGroup: extension_group,
    },
  }
}



const _connectionDataToEdge = (
  sourceNodeId: string,
  data: IConnectionData[],
  nodes: IExtensionNode[],
): Edge[] => {
  let edges: Edge[] = []

  data.forEach((i) => {
    const { dest = [], name } = i
    dest.forEach((d) => {
      const sourceHandleId = `${name}`
      const targetNodeId = getNodeId(d.extension_group, d.extension)
      const targetHandleId = `${name}`

      const sourceNode = nodes.find((i) => i.id == sourceNodeId)
      if (!sourceNode) {
        logger.warn(`Invalid source node: ${sourceNodeId}`)
        return
      }
      let hasOutputHandle = sourceNode.data.outputs.some((output) => output.name == name)
      if (!hasOutputHandle) {
        logger.warn(`Invalid output handle: ${name} in source node: ${sourceNode.data.name}`)
        return
      }

      const targetNode = nodes.find((i) => i.id == targetNodeId)
      if (!targetNode) {
        logger.warn(`Invalid target node: ${targetNodeId}`)
        return
      }
      let hasInputHandle = targetNode.data.inputs.some((input) => input.name == name)
      if (!hasInputHandle){
        logger.warn(`Invalid input handle: ${name} in target node: ${targetNode.data.name}`)
        return
      }

        let edg = {
          id: genEdgeId(),
          source: sourceNodeId,
          sourceHandle: sourceHandleId,
          target: targetNodeId,
          targetHandle: targetHandleId,
        } as Edge

      edges.push(edg)
    })
  })

  return edges
}

export const connectionsToEdges = (connections: IConnection[], nodes: IExtensionNode[]): Edge[] => {
  const edges: Edge[] = []
  connections.forEach((connection) => {
    const { cmd = [], data = [], pcm_frame = [], extension, extension_group } = connection
    const sourceNodeId = getNodeId(extension_group, extension)
    if (cmd.length) {
      const cmdEdges = _connectionDataToEdge(sourceNodeId, cmd, nodes)
      edges.push(...cmdEdges)
    }
    if (data.length) {
      const dataEdges = _connectionDataToEdge(sourceNodeId, data, nodes)
      edges.push(...dataEdges)
    }
    if (pcm_frame.length) {
      const pcmFrameEdges = _connectionDataToEdge(sourceNodeId, pcm_frame, nodes)
      edges.push(...pcmFrameEdges)
    }
    return edges
  })

  return edges
}

// export const handleIdToType = (id: string): MsgType => {
//   const data = id.split("/")
//   if (!data[1]) {
//     throw new Error(`Invalid handle id: ${id}`)
//   }
//   return data[1] as MsgType
// }

export const nodesToExtensions = (
  nodes: IExtensionNode[],
  installedExtensions: IExtension[],
): IExtension[] => {
  return nodes.map((node) => {
    const { data } = node
    const { extensionGroup = "default", name, addon } = data
    // const 
    const extension = installedExtensions.find((i) => i.addon == addon)
    if (!extension) {
      throw new Error(`Invalid extension: ${name}, not found in installed extensions`)
    }
    return {
      ...extension,
      extension_group: extensionGroup,
    }
  })
}

export const edgesToConnections = (edges: Edge[]): IConnection[] => {
  let connections: IConnection[] = []
  for (let edge of edges) {
    const { source, sourceHandle, target, targetHandle } = edge
    const sourceHandleName = sourceHandle?.split("/")[1]
    if (!sourceHandleName) {
      throw new Error(`Invalid source handle: ${sourceHandle}`)
    }
    const curConnection = connections.find((i) => i.extension == source)
    if (curConnection) {
      curConnection.data = curConnection?.data ? curConnection.data : []
      const curData = curConnection.data.find(
        (item) => item.name == sourceHandleName,
      )
      if (curData) {
        curData.dest.push({
          app: DEFAULT_APP,
          extension_group: DEFAULT_EXTENTION_GROUP,
          extension: target,
        })
      } else {
        curConnection.data.push({
          name: sourceHandleName,
          dest: [
            {
              app: DEFAULT_APP,
              extension_group: DEFAULT_EXTENTION_GROUP,
              extension: target,
            },
          ],
        })
      }
    } else {
      connections.push({
        app: DEFAULT_APP,
        extension: source,
        extension_group: DEFAULT_EXTENTION_GROUP,
        data: [
          {
            name: sourceHandleName,
            dest: [
              {
                app: DEFAULT_APP,
                extension_group: DEFAULT_EXTENTION_GROUP,
                extension: target,
              },
            ],
          },
        ],
      })
    }
  }

  return connections
}
