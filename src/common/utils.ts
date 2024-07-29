import { Edge, Node, XYPosition, Position, Connection } from "@xyflow/react"
import {
  IExtension,
  IConnection,
  IConnectionData,
  DataType,
  InOutData,
  ExtensionNode,
  ICompatibleConnection,
  ConnectDirection,
  CustomEdge,
} from "@/types"
import { DEFAULT_APP, DEFAULT_EXTENTION_GROUP } from "./constant"
import { logger } from "./logger"
import { editorData } from "./data"


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
): ExtensionNode[] => {
  return extensions.map((extension, index) => {
    const position = {
      x: index * 300,
      y: round(-200, 200),
    }
    return extensionToNode(extension, { position })
  })
}

export const extensionToNode = (
  extension: IExtension,
  property: {
    position: XYPosition
  },
): ExtensionNode => {
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

  const id = editorData.genNodeId()
  editorData.saveNodeId(extension_group, name, id)

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

const connectionToEdges = (
  connection: IConnection,
  nodes: ExtensionNode[],
): Edge[] => {
  let edges: Edge[] = []
  const { cmd = [], data = [], pcm_frame = [], img_frame = [], extension, extension_group } = connection
  const sourceNodeId = editorData.getNodeId(extension_group, extension)
  const dataType = getDataType(connection)
  let finalData: IConnectionData[] = []
  if (dataType == "cmd") {
    finalData = cmd
  } else if (dataType == "data") {
    finalData = data
  } else if (dataType == "pcm_frame") {
    finalData = pcm_frame
  } else if (dataType == "img_frame") {
    finalData = img_frame
  }
  finalData.forEach((i) => {
    const { dest = [], name } = i
    dest.forEach((d) => {
      const sourceHandleId = `${name}`
      const targetNodeId = editorData.getNodeId(d.extension_group, d.extension)
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
      if (!hasInputHandle) {
        logger.warn(`Invalid input handle: ${name} in target node: ${targetNode.data.name}`)
        return
      }

      let edg = {
        id: editorData.genEdgeId(),
        source: sourceNodeId,
        sourceHandle: sourceHandleId,
        target: targetNodeId,
        targetHandle: targetHandleId,
        data: {
          dataType
        }
      }

      edges.push(edg)
    })
  })

  return edges
}

export const connectionsToEdges = (connections: IConnection[], nodes: ExtensionNode[]): CustomEdge[] => {
  const edges: Edge[] = []
  connections.forEach((connection) => {
    const tempEdges = connectionToEdges(connection, nodes)
    if (tempEdges.length) {
      edges.push(...tempEdges)
    }
    return edges
  })

  return edges
}


export const getDataType = (connection: IConnection): DataType => {
  if (connection.cmd) {
    return "cmd"
  } else if (connection.data) {
    return "data"
  } else if (connection.pcm_frame) {
    return "pcm_frame"
  } else if (connection.img_frame) {
    return "img_frame"
  }
  throw new Error(`Invalid connection: ${connection} in getDataType`)
}

export const nodesToExtensions = (
  nodes: ExtensionNode[],
  installedExtensions: IExtension[],
): IExtension[] => {
  return nodes.map((node) => {
    const { data } = node
    const { extensionGroup, name, addon } = data
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

export const edgesToConnections = (edges: Edge[], nodes: ExtensionNode[]): IConnection[] => {
  let connections: IConnection[] = []
  for (let edge of edges) {
    const { source, sourceHandle, target, targetHandle, data } = edge
    const { dataType } = data as { dataType: DataType }
    const sourceNode = nodes.find((i) => i.id == source)
    const targetNode = nodes.find((i) => i.id == target)
    if (!sourceNode) {
      throw new Error(`Invalid source node: ${source} when edges => connections`)
    }
    if (!targetNode) {
      throw new Error(`Invalid target node: ${target} when edges => connections`)
    }
    if (!sourceHandle) {
      throw new Error(`Invalid source handle: ${sourceHandle} in node: ${source} when edges => connections`)
    }
    if (!targetHandle) {
      throw new Error(`Invalid target handle: ${targetHandle} in node: ${target} when edges => connections`)
    }
    const sourceNodeName = sourceNode?.data.name
    const sourceNodeExtensionGroup = sourceNode?.data.extensionGroup

    const targetNodeName = targetNode?.data.name
    const targetNodeExtensionGroup = targetNode?.data.extensionGroup

    const connectionData: IConnectionData = {
      name: sourceHandle,
      dest: [
        {
          app: DEFAULT_APP,
          extension_group: targetNodeExtensionGroup,
          extension: targetNodeName,
        },
      ],
    }

    const tarConnection = connections.find((i) => i.extension == sourceNodeName && i.extension_group == sourceNodeExtensionGroup)

    if (tarConnection) {
      if (tarConnection[dataType]?.length) {
        tarConnection[dataType].push(connectionData)
      } else {
        tarConnection[dataType] = [connectionData]
      }
    } else {
      connections.push({
        app: DEFAULT_APP,
        extension: sourceNodeName,
        extension_group: sourceNodeExtensionGroup,
        [dataType]: [
          connectionData
        ],
      })
    }
  }

  return connections
}


export const setNodesStatusDisabled = (nodes: ExtensionNode[]): ExtensionNode[] => {
  return nodes.map((node) => {
    return {
      ...node,
      data: {
        ...node.data,
        status: "disabled",
        inputs: node.data.inputs.map((input: any) => {
          return {
            ...input,
            status: "disabled",
          }
        }),
        outputs: node.data.outputs.map((output: any) => {
          return {
            ...output,
            status: "disabled",
          }
        }),
      },
    }
  })
}


export const highlightNodesWithConnections = (nodes: ExtensionNode[], connections: ICompatibleConnection[]): ExtensionNode[] => {
  return nodes.map((node) => {
    const nodeName = node.data.name
    const extensionGroup = node.data.extensionGroup
    const targetConnection = connections.find((c) => c.extension == nodeName && c.extension_group == extensionGroup)
    let data = node.data
    let { inputs, outputs } = data
    const isIn = targetConnection?.msg_direction == "in"
    const isOut = targetConnection?.msg_direction == "out"
    inputs = inputs.map((input) => {
      return {
        ...input,
        status:
          targetConnection && input.name == targetConnection.msg_name && isIn
            ? "enabled"
            : "disabled",
      }
    })
    outputs = outputs.map((output) => {
      return {
        ...output,
        status:
          targetConnection &&
            output.name == targetConnection.msg_name &&
            isOut
            ? "enabled"
            : "disabled",
      }
    })
    return {
      ...node,
      data: {
        ...data,
        inputs,
        outputs,
        status: targetConnection ? "enabled" : "disabled",
      },
    }
  })

}


export const getConnectableEdge = (params: Connection, connectDirection: ConnectDirection, nodes: ExtensionNode[]): CustomEdge | null => {
  const { source, target, sourceHandle, targetHandle } = params
  const targetNodeId = target
  const targetHandleName = targetHandle
  if (targetNodeId && targetHandleName) {
    const targetNode = nodes.find((item) => item.id === targetNodeId)
    if (targetNode?.data.status == "enabled") {
      let inputs = targetNode?.data.inputs ?? []
      let outputs = targetNode?.data.outputs ?? []
      const arr: InOutData[] = connectDirection == ConnectDirection.Positive ? inputs : outputs
      let targetHandler = arr.find(
        (item) => item.name == targetHandleName && item.status == "enabled"
      )
      if (targetHandler) {
        return {
          id: editorData.genEdgeId(),
          source: source,
          sourceHandle: sourceHandle,
          target: targetNodeId,
          targetHandle: targetHandleName,
          data: {
            dataType: targetHandler.type
          }
        }
      }
    }
  }
  return null
}
