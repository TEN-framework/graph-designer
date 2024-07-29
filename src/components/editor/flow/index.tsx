import {
  useCallback,
  useMemo,
  useEffect,
  useState,
  ComponentType,
  useRef,
} from "react"
import {
  ReactFlow,
  Connection,
  useNodesState,
  useReactFlow,
  useEdgesState,
  Node,
  Edge,
  addEdge,
  Controls,
  Background,
  OnConnectStartParams,
  MarkerType,
  useNodesInitialized,
  useOnSelectionChange,
  DefaultEdgeOptions,
} from "@xyflow/react"
import type { NodeTypes, EdgeTypes, BuiltInNode } from "@xyflow/react"
import ExtensionNode from "./nodes/extension"
import { message } from "antd"
import {
  useAppSelector,
  apiGetGraphExtension,
  connectionsToEdges,
  extensionToNode,
  apiGetGraphConnection,
  extensionsToNodes,
  apiQueryCompatibleMessage,
  edgesToConnections,
  sleep,
  nodesToExtensions,
  apiUpdateGraph,
  useAppDispatch,
  logger,
  DEFAULT_APP,
  setNodesStatusDisabled,
  highlightNodesWithConnections,
  checkConnectableEdge
} from "@/common"
import { eventManger } from "@/manager"
import {
  IExtension,
  ICompatibleConnection,
  ConnectDirection,
  InOutData,
  IExtensionNode,
  CustomNodeType,
} from "@/types"
import { setSaveStatus } from "@/store/reducers/global"

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  // stroke: 'black'
  style: { strokeWidth: 1.5 },
  type: "smoothstep",
  markerEnd: {
    width: 12,
    height: 12,
    type: MarkerType.ArrowClosed,
    // color: 'red',
  },
}
const initialNodes: IExtensionNode[] = []
const initialEdges: Edge[] = []
const nodeTypes: NodeTypes = {
  extension: ExtensionNode,
}
const edgeTypes: EdgeTypes = {
  // animated: true,
  // pathOptions: {
  //   offset: 30,
  //   borderRadius: 100
  // },
}

let connectDirection = ConnectDirection.Positive
let hasInit = false

const Flow = () => {
  const dispatch = useAppDispatch()
  const [messageApi, contextHolder] = message.useMessage()
  const curGraphName = useAppSelector((state) => state.global.curGraphName)
  const autoStart = useAppSelector((state) => state.global.autoStart)
  const installedExtensions = useAppSelector(
    (state) => state.global.installedExtensions,
  )
  const { screenToFlowPosition } = useReactFlow()
  const [nodes, setNodes, onNodesChange] =
    useNodesState<IExtensionNode>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    eventManger.on("extentionGroupChanged", handleExtentionGroupChanged)

    return () => {
      eventManger.off("extentionGroupChanged", handleExtentionGroupChanged)
    }
  }, [nodes, edges])

  useEffect(() => {
    if (curGraphName) {
      getData()
    }
  }, [curGraphName])

  useEffect(() => {
    if (hasInit) {
      saveFlow(nodes, edges)
    }
  }, [nodes.length, edges.length])

  const getData = async () => {
    const extensions = await apiGetGraphExtension(curGraphName)
    logger.debug("graph extensions", extensions)
    const nodes = extensionsToNodes(extensions)
    logger.debug("graph nodes", nodes)
    setNodes(nodes)

    const connections = await apiGetGraphConnection(curGraphName)
    logger.debug("graph connections", connections)

    const edges = connectionsToEdges(connections, nodes)
    logger.debug("graph edges", edges)
    setEdges(edges)

    hasInit = true
  }

  const saveFlow = async (nodes: IExtensionNode[], edges: Edge[]) => {
    try {
      dispatch(setSaveStatus("saving"))
      logger.debug("saveFlow", nodes, edges)
      const extensions = nodesToExtensions(nodes, installedExtensions)
      const connections = edgesToConnections(edges, nodes)
      logger.debug("saveFlow extensions", extensions)
      logger.debug("saveFlow connections", connections)
      await apiUpdateGraph(curGraphName, {
        auto_start: autoStart,
        extensions: extensions,
        connections: connections,
      })
      dispatch(setSaveStatus("success"))
    } catch (e: any) {
      messageApi.error(e.message)
      dispatch(setSaveStatus("failed"))
    }
  }

  const handleExtentionGroupChanged = async (
    extensionName: string,
    extensionGroup: string,
  ) => {
    const targetNode = nodes.find(
      (item) => item.data.name === extensionName,
    )
    if (!targetNode) {
      return
    }
    const { data } = targetNode
    if (data?.extensionGroup != extensionGroup) {
      const newNodes = nodes.map((node) => {
        if (node.data.name === extensionName) {
          return {
            ...node, data: {
              ...node.data,
              extensionGroup: extensionGroup
            }
          }
        }
        return node
      })
      setNodes(newNodes)
      await saveFlow(newNodes, edges)
    }
  }

  // reset node/handle default status
  const resetNodeStatus = () => {
    setNodes(nodes.map((node) => {
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
    }))
  }

  // ----------------- Drag and Drop -----------------
  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault()
      const type = event.dataTransfer.getData("type")
      const extension: IExtension = JSON.parse(
        event.dataTransfer.getData("extension"),
      )

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }

      if (nodes.find((item) => extension.name === item.id)) {
        return messageApi.error(
          `Extension ${extension.name} already exists editor`,
        )
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = extensionToNode(extension, {
        position,
      })

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, nodes],
  )

  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // ------------------ Connect ------------------
  const onConnectStart = async (
    event: MouseEvent | TouchEvent,
    params: OnConnectStartParams,
  ) => {
    await getConnectableNodes(params)
  }

  const getConnectableNodes = async (params: OnConnectStartParams) => {
    const { handleId = "", nodeId, handleType } = params
    const handleName = handleId
    const targetNode = nodes.find((item) => item.id === nodeId)
    const targetNodeName = targetNode?.data?.name ?? ""
    const targetNodeExtensionGroup = targetNode?.data?.extensionGroup ?? ""

    const options: ICompatibleConnection = {
      app: DEFAULT_APP,
      graph: curGraphName,
      extension_group: targetNodeExtensionGroup,
      extension: targetNodeName,
      msg_type: "",
      msg_name: "",
      msg_direction: "",
    }
    if (handleType == "source") {
      const outputs = targetNode?.data.outputs ?? []
      const target = outputs.find((item) => item.name === handleName)
      if (!target) {
        return logger.warn(`Handle:${handleName} not found in node:${targetNodeName}`)
      }
      options.msg_direction = "out"
      options.msg_type = target.type
      options.msg_name = target.name
      connectDirection = ConnectDirection.Positive
    } else if (handleType == "target") {
      options.msg_direction = "in"
      const inputs = targetNode?.data.inputs ?? []
      const target = inputs.find((item) => item.name === handleName)
      if (!target) {
        return logger.warn(`Handle:${handleName} not found in node:${targetNodeName}`)
      }
      options.msg_type = target.type
      options.msg_name = target.name
      connectDirection = ConnectDirection.Negative
    }
    try {
      const connections = await apiQueryCompatibleMessage(options)
      if (connections.length) {
        setNodes(highlightNodesWithConnections(nodes, connections))
      } else {
        setNodes(setNodesStatusDisabled(nodes))
      }
    } catch (e: any) {
      messageApi.error(e.message)
    }
  }

  const onConnect = (params: Connection | Edge) => {
    logger.debug("onConnect", params)
    if (checkConnectableEdge(params, connectDirection, nodes)) {
      setEdges((eds) => {
        return addEdge(params, eds)
      })
    }
  }

  const onConnectEnd = () => {
    logger.debug("onConnectEnd")
    resetNodeStatus()

  }

  return (
    <>
      {contextHolder}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onConnectStart={onConnectStart}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1,
        }}
      >
        <Controls />
        <Background></Background>
      </ReactFlow>
    </>
  )
}

export default Flow
