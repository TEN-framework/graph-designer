import { Edge, Node, XYPosition, Position } from "@xyflow/react"
import {
  IExtension,
  IConnection,
  IConnectionData,
  MsgType,
  InOutData,
  IExtensionNode,
} from "@/types"

let EDGE_ID = 0

const getEdgeId = () => {
  return `${EDGE_ID++}`
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
  const { api } = extension
  if (api?.cmd_in) {
    api.cmd_in.forEach((input) => {
      inputs.push({ id: input.name, type: "cmd", status: "default" })
    })
  }
  if (api?.cmd_out) {
    api.cmd_out.forEach((output) => {
      outputs.push({ id: output.name, type: "cmd", status: "default" })
    })
  }
  if (api?.data_in) {
    api.data_in.forEach((input) => {
      inputs.push({ id: input.name, type: "data", status: "default" })
    })
  }
  if (api?.data_out) {
    api.data_out.forEach((output) => {
      outputs.push({ id: output.name, type: "data", status: "default" })
    })
  }
  if (api?.pcm_frame_in) {
    api.pcm_frame_in.forEach((input) => {
      inputs.push({ id: input.name, type: "pcm_frame", status: "default" })
    })
  }
  if (api?.pcm_frame_out) {
    api.pcm_frame_out.forEach((output) => {
      outputs.push({ id: output.name, type: "pcm_frame", status: "default" })
    })
  }
  if (api?.img_frame_in) {
    api.img_frame_in.forEach((input) => {
      inputs.push({ id: input.name, type: "img_frame", status: "default" })
    })
  }
  if (api?.img_frame_out) {
    api.img_frame_out.forEach((output) => {
      outputs.push({ id: output.name, type: "img_frame", status: "default" })
    })
  }

  return {
    // TIP: extension.name just a property
    // id should use extension.addon (like: class name)
    id: extension.addon,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: position,
    type: "extension",
    data: {
      status: "default",
      name: extension.name,
      inputs: inputs,
      outputs: outputs,
      extensionGroup: extension.extension_group,
    },
  }
}

const _connectionDataToEdge = (
  extensionName: string,
  data: IConnectionData[],
): Edge[] => {
  let edges: Edge[] = []
  data.forEach((i) => {
    const { dest = [], name } = i
    dest.forEach((d) => {
      let edg = {
        id: getEdgeId(),
        source: extensionName,
        sourceHandle: `${extensionName}/${name}`,
        target: d.extension,
        targetHandle: `${d.extension}/${name}`,
      } as Edge
      edges.push(edg)
    })
  })

  return edges
}

export const connectionsToEdges = (connections: IConnection[]): Edge[] => {
  const edges: Edge[] = []
  connections.forEach((connection) => {
    const { cmd = [], data = [], pcm_frame = [], extension } = connection
    if (cmd.length) {
      const cmdEdges = _connectionDataToEdge(extension, cmd)
      edges.push(...cmdEdges)
    }
    if (data.length) {
      const dataEdges = _connectionDataToEdge(extension, data)
      edges.push(...dataEdges)
    }
    if (pcm_frame.length) {
      const pcmFrameEdges = _connectionDataToEdge(extension, pcm_frame)
      edges.push(...pcmFrameEdges)
    }
    return edges
  })

  return edges
}

export const handleIdToType = (id: string): MsgType => {
  const data = id.split("/")
  if (!data[1]) {
    throw new Error(`Invalid handle id: ${id}`)
  }
  return data[1] as MsgType
}

export const nodesToExtensions = (
  nodes: IExtensionNode[],
  installedExtensions: IExtension[],
): IExtension[] => {
  return nodes.map((node) => {
    const { id, data } = node
    const { extensionGroup = "default" } = data
    const extension = installedExtensions.find((i) => i.name == id)
    if (!extension) {
      throw new Error(`Invalid extension: ${id}`)
    }
    return {
      ...extension,
      extension_group: extensionGroup,
    }
  })
}

export const edgesToConnections = (edges: Edge[]): IConnection[] => {
  let connections: IConnection[] = []
  const app = "localhost"
  const extension_group = "default"
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
          app: "localhost",
          extension_group,
          extension: target,
        })
      } else {
        curConnection.data.push({
          name: sourceHandleName,
          dest: [
            {
              app: "localhost",
              extension_group,
              extension: target,
            },
          ],
        })
      }
    } else {
      connections.push({
        app,
        extension: source,
        extension_group,
        data: [
          {
            name: sourceHandleName,
            dest: [
              {
                app: "localhost",
                extension_group,
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
