import { Edge, Node, XYPosition, Position } from "reactflow"
import {
  IExtension, IConnection,
  IConnectionData, MsgType, InOutData,
  IExtensionNode
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


export const extensionsToNodes = (extensions: IExtension[]): IExtensionNode[] => {
  return extensions.map((extension, index) => {
    const position = { x: index * 250 + 50, y: 300 + (index % 2 == 0 ? 1 : -1) * 120 }
    return extensionToNode(extension, { position })
  })
}

export const extensionToNode = (extension: IExtension, property: {
  position: XYPosition
}): IExtensionNode => {
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
    id: extension.name,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: position,
    type: "extension",
    data: {
      status: "default",
      name: extension.name,
      inputs: inputs,
      outputs: outputs,
    },
  }
}

const _connectionDataToEdge = (extensionName: string, data: IConnectionData[]): Edge[] => {
  let edges: Edge[] = []
  data.forEach(i => {
    const { dest = [], name } = i
    dest.forEach(d => {
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


// DataTest => data_test
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, match => "_" + match.toLowerCase()).slice(1)
}
