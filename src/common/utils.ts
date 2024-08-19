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
  LayoutDirection,
  PropertyType,
  InputType,
} from "@/types"
import {
  DEFAULT_APP,
  DEFAULT_EXTENTION_GROUP,
  DEFAULT_HANDLE_HEIGHT,
  DEFAULT_NODE_WIDTH,
} from "./constant"
import { logger } from "./logger"
import { editorData } from "./data"
import dagre from "@dagrejs/dagre"



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

export const hasDecimalPoint = (n: number): boolean => {
  return !Number.isNaN(n) && n % 1 !== 0;
}

export const isNumberType = (type: PropertyType): boolean => {
  return type === "int8" || type === "int16" || type === "int32" || type === "int64" ||
    type === "Uint8" || type === "Uint16" || type === "Uint32" || type === "Uint64" ||
    type === "float32" || type === "float64"
}

export const getZeroValue = (type: InputType) => {
  if (type === "number") {
    return 0
  } else if (type === "boolean") {
    return false
  }
  return ""
}

// ----------------------- graph ---------------------

// https://github.com/dagrejs/dagre/wiki#using-dagre
export const getLayoutedElements = (
  nodes: ExtensionNode[],
  edges: CustomEdge[],
  direction: LayoutDirection = "TB",
): {
  nodes: ExtensionNode[]
  edges: CustomEdge[]
} => {
  const nodeWidth = DEFAULT_NODE_WIDTH
  const nodeHeight = 50
  const isHorizontal = direction === "LR"
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 200,
    edgesep: 50,
    ranksep: 120,
  })

  let tempNodeMap = new Map()

  nodes.forEach((node) => {
    let { data } = node
    const { inputs = [], outputs = [] } = data
    const finNodeWidth = nodeWidth
    const finNodeHeight = nodeHeight + Math.max(inputs.length, outputs.length) * DEFAULT_HANDLE_HEIGHT
    dagreGraph.setNode(node.id, {
      width: finNodeWidth,
      height: finNodeHeight,
    })
    tempNodeMap.set(node.id, {
      width: finNodeWidth,
      height: finNodeHeight,
    })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    const { width, height } = tempNodeMap.get(node.id)
    const newNode: ExtensionNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    }

    return newNode
  })

  return { nodes: newNodes, edges }
}

export const extensionsToNodes = (
  extensions: IExtension[],
): ExtensionNode[] => {
  return extensions.map((extension, index) => {
    const position = { x: 0, y: 0 }
    return extensionToNode(extension, { position })
  })
}

export const extensionToNode = (
  extension: IExtension,
  options: {
    position: XYPosition
  },
): ExtensionNode => {
  const { position } = options
  const inputs: InOutData[] = []
  const outputs: InOutData[] = []
  let propertyTypes
  const { api, extension_group, name, addon, property } = extension
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
  if (api?.audio_frame_in) {
    api.audio_frame_in.forEach((input) => {
      inputs.push({ name: input.name, type: "pcm_frame", status: "default" })
    })
  }
  if (api?.audio_frame_out) {
    api.audio_frame_out.forEach((output) => {
      outputs.push({ name: output.name, type: "pcm_frame", status: "default" })
    })
  }
  if (api?.video_frame_in) {
    api.video_frame_in.forEach((input) => {
      inputs.push({ name: input.name, type: "image_frame", status: "default" })
    })
  }
  if (api?.video_frame_out) {
    api.video_frame_out.forEach((output) => {
      outputs.push({ name: output.name, type: "image_frame", status: "default" })
    })
  }
  if (api?.property) {
    propertyTypes = api.property
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
      property: property,
      propertyTypes: propertyTypes,
    },
  }
}

const connectionToEdges = (
  connection: IConnection,
  nodes: ExtensionNode[],
): CustomEdge[] => {
  let edges: CustomEdge[] = []
  const {
    cmd,
    data,
    pcm_frame,
    image_frame,
    extension,
    extension_group,
  } = connection
  const sourceNodeId = editorData.getNodeId(extension_group, extension)
  const sourceNode = nodes.find((i) => i.id == sourceNodeId)
  if (!sourceNode) {
    logger.warn(`Invalid source node: ${sourceNodeId}`)
    return edges
  }
  let finalData: {
    [key in DataType]?: IConnectionData[]
  } = {}
  if (cmd?.length) {
    finalData["cmd"] = cmd
  }
  if (data?.length) {
    finalData["data"] = data
  }
  if (pcm_frame?.length) {
    finalData["pcm_frame"] = pcm_frame
  }
  if (image_frame?.length) {
    finalData["image_frame"] = image_frame
  }
  const keys = Object.keys(finalData) as Array<keyof {
    [key in DataType]?: IConnectionData[]
  }>
  keys.forEach((key) => {
    let data = finalData[key]
    let dataType = key
    data?.forEach((d) => {
      const { dest = [], name } = d
      dest.forEach((destItem) => {
        const targetNodeId = editorData.getNodeId(destItem.extension_group, destItem.extension)
        const targetHandleId = `${name}`

        const sourceHandleId = `${name}`
        let hasOutputHandle = sourceNode.data.outputs.some(
          (output) => output.name == name,
        )
        if (!hasOutputHandle) {
          logger.warn(
            `Invalid output handle: ${name} in source node: ${sourceNode.data.name}`,
          )
          return
        }

        const targetNode = nodes.find((i) => i.id == targetNodeId)
        if (!targetNode) {
          logger.warn(`Invalid target node: ${targetNodeId}`)
          return
        }
        let hasInputHandle = targetNode.data.inputs.some(
          (input) => input.name == name,
        )
        if (!hasInputHandle) {
          logger.warn(
            `Invalid input handle: ${name} in target node: ${targetNode.data.name}`,
          )
          return
        }

        let edg = {
          id: editorData.genEdgeId(),
          source: sourceNodeId,
          sourceHandle: sourceHandleId,
          target: targetNodeId,
          targetHandle: targetHandleId,
          data: {
            dataType,
          },
          label: dataType,
        }

        edges.push(edg)
      })


    })
  })



  return edges
}

export const connectionsToEdges = (
  connections: IConnection[],
  nodes: ExtensionNode[],
): CustomEdge[] => {
  const edges: CustomEdge[] = []
  connections.forEach((connection) => {
    const tempEdges = connectionToEdges(connection, nodes)
    if (tempEdges.length) {
      edges.push(...tempEdges)
    }
    return edges
  })

  return edges
}



export const nodesToExtensions = (
  nodes: ExtensionNode[],
  installedExtensions: IExtension[],
): IExtension[] => {
  return nodes.map((node) => {
    const { data } = node
    const { extensionGroup, name, addon, property = null } = data
    const extension = installedExtensions.find((i) => i.addon == addon)
    if (!extension) {
      throw new Error(
        `Invalid extension: ${name}, not found in installed extensions`,
      )
    }
    const { api } = extension
    return {
      app: DEFAULT_APP,
      api,
      addon,
      name,
      property,
      extension_group: extensionGroup,
    }
  })
}

export const edgesToConnections = (
  edges: Edge[],
  nodes: ExtensionNode[],
): IConnection[] => {
  let connections: IConnection[] = []
  for (let edge of edges) {
    const { source, sourceHandle, target, targetHandle, data } = edge
    const { dataType } = data as { dataType: DataType }
    const sourceNode = nodes.find((i) => i.id == source)
    const targetNode = nodes.find((i) => i.id == target)
    if (!sourceNode) {
      throw new Error(
        `Invalid source node: ${source} when edges => connections`,
      )
    }
    if (!targetNode) {
      throw new Error(
        `Invalid target node: ${target} when edges => connections`,
      )
    }
    if (!sourceHandle) {
      throw new Error(
        `Invalid source handle: ${sourceHandle} in node: ${source} when edges => connections`,
      )
    }
    if (!targetHandle) {
      throw new Error(
        `Invalid target handle: ${targetHandle} in node: ${target} when edges => connections`,
      )
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

    const tarConnection = connections.find(
      (i) =>
        i.extension == sourceNodeName &&
        i.extension_group == sourceNodeExtensionGroup,
    )

    if (tarConnection) {
      if (tarConnection[dataType]?.length) {
        tarConnection[dataType]?.push(connectionData)
      } else {
        tarConnection[dataType] = [connectionData]
      }
    } else {
      connections.push({
        app: DEFAULT_APP,
        extension: sourceNodeName,
        extension_group: sourceNodeExtensionGroup,
        [dataType]: [connectionData],
      })
    }
  }

  return connections
}

export const setNodesStatusDisabled = (
  nodes: ExtensionNode[],
): ExtensionNode[] => {
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

export const highlightNodesWithConnections = (
  nodes: ExtensionNode[],
  connections: ICompatibleConnection[],
): ExtensionNode[] => {
  return nodes.map((node) => {
    const nodeName = node.data.name
    const extensionGroup = node.data.extensionGroup
    const targetConnection = connections.find(
      (c) => c.extension == nodeName && c.extension_group == extensionGroup,
    )
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
          targetConnection && output.name == targetConnection.msg_name && isOut
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

export const getConnectableEdge = (
  params: Connection,
  connectDirection: ConnectDirection,
  nodes: ExtensionNode[],
): CustomEdge | null => {
  const { source, target, sourceHandle, targetHandle } = params
  const targetNodeId = target
  const targetHandleName = targetHandle
  if (targetNodeId && targetHandleName) {
    const targetNode = nodes.find((item) => item.id === targetNodeId)
    if (targetNode?.data.status == "enabled") {
      let inputs = targetNode?.data.inputs ?? []
      let outputs = targetNode?.data.outputs ?? []
      const arr: InOutData[] =
        connectDirection == ConnectDirection.Positive ? inputs : outputs
      let targetHandler = arr.find(
        (item) => item.name == targetHandleName && item.status == "enabled",
      )
      if (targetHandler) {
        return {
          id: editorData.genEdgeId(),
          source: source,
          sourceHandle: sourceHandle,
          target: targetNodeId,
          targetHandle: targetHandleName,
          data: {
            dataType: targetHandler.type,
          },
        }
      }
    }
  }
  return null
}


export const resetNodesStatus = (nodes: ExtensionNode[]): ExtensionNode[] => {
  return nodes.map((node) => {
    return {
      ...node,
      data: {
        ...node.data,
        status: "default",
        inputs: node.data.inputs.map((input: any) => {
          return {
            ...input,
            status: "default",
          }
        }),
        outputs: node.data.outputs.map((output: any) => {
          return {
            ...output,
            status: "default",
          }
        }),
      },
    }
  })
}
