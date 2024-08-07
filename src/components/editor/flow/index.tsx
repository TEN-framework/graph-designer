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
import ExtensionNodeComponent from "./nodes/index"
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
  getConnectableEdge,
  getLayoutedElements,
  resetNodesStatus,
  editorData
} from "@/common"
import { eventManger } from "@/manager"
import {
  IExtension,
  ICompatibleConnection,
  ConnectDirection,
  InOutData,
  ExtensionNode,
  CustomNodeType,
  CustomEdge,
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
const initialNodes: ExtensionNode[] = []
const initialEdges: CustomEdge[] = []
const nodeTypes: NodeTypes = {
  extension: ExtensionNodeComponent,
}
const edgeTypes: EdgeTypes = {

}

let connectDirection = ConnectDirection.Positive
let hasInit = false

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges,
  "LR",
)

const Flow = () => {
  const dispatch = useAppDispatch()
  const [messageApi, contextHolder] = message.useMessage()
  const curGraphName = useAppSelector((state) => state.global.curGraphName)
  const autoStart = useAppSelector((state) => state.global.autoStart)
  const installedExtensions = useAppSelector(
    (state) => state.global.installedExtensions,
  )
  const { screenToFlowPosition, fitView } = useReactFlow()
  const [nodes, setNodes, onNodesChange] =
    useNodesState<ExtensionNode>(layoutedNodes)
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<CustomEdge>(layoutedEdges)

  useEffect(() => {
    eventManger.on("extentionGroupChanged", handleExtentionGroupChanged)
    eventManger.on("extentionPropertyChanged", handleExtentionPropertyChanged)

    return () => {
      eventManger.off("extentionGroupChanged", handleExtentionGroupChanged)
      eventManger.off("extentionPropertyChanged", handleExtentionPropertyChanged)
    }
  }, [nodes, edges])

  useEffect(() => {
    if (curGraphName) {
      editorData.clear()
      getData()
      fitView();
    }
  }, [curGraphName])

  useEffect(() => {
    if (hasInit) {
      saveFlow(nodes, edges)
    }
  }, [nodes.length, edges.length])

  const getData = async () => {
    try {
      logger.debug("-------------- getData start --------------")
      const extensions = await apiGetGraphExtension(curGraphName)
      logger.debug("graph extensions", extensions)
      const nodes = extensionsToNodes(extensions)
      logger.debug("graph nodes", nodes)
      const connections = await apiGetGraphConnection(curGraphName)
      logger.debug("graph connections", connections)
      const edges = connectionsToEdges(connections, nodes)
      logger.debug("graph edges", edges)
      logger.debug("-------------- getData end --------------")

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        "LR",
      )

      setNodes(layoutedNodes)
      setEdges(layoutedEdges)

      hasInit = true
    } catch (err: any) {
      messageApi.error(err.message)
      throw err
    }
  }

  const saveFlow = async (nodes: ExtensionNode[], edges: Edge[]) => {
    try {
      logger.debug("------------------- saveFlow start -------------------")
      dispatch(setSaveStatus("saving"))
      logger.debug("saveFlow nodes:", nodes)
      logger.debug("saveFlow edges:", edges)
      const extensions = nodesToExtensions(nodes, installedExtensions)
      const connections = edgesToConnections(edges, nodes)
      logger.debug("saveFlow extensions:", extensions)
      logger.debug("saveFlow connections:", connections)
      await apiUpdateGraph(curGraphName, {
        auto_start: autoStart,
        nodes: extensions,
        connections: connections,
      })
      dispatch(setSaveStatus("success"))
      logger.debug("------------------- saveFlow end -------------------")
    } catch (e: any) {
      messageApi.error(e.message)
      dispatch(setSaveStatus("failed"))
    }
  }

  const handleExtentionGroupChanged = async (
    extensionName: string,
    extensionGroup: string,
  ) => {
    const targetNode = nodes.find((item) => item.data.name === extensionName)
    if (!targetNode) {
      return
    }
    const newNodes = nodes.map((node) => {
      if (node.data.name === extensionName) {
        return {
          ...node,
          data: {
            ...node.data,
            extensionGroup: extensionGroup,
          },
        }
      }
      return node
    })
    setNodes(newNodes)
    await saveFlow(newNodes, edges)
  }

  const handleExtentionPropertyChanged = async (extensionName: string, key: string, value: any) => {
    const targetNode = nodes.find((item) => item.data.name === extensionName)
    if (!targetNode) {
      return
    }
    const newNodes = nodes.map((node) => {
      if (node.data.name === extensionName) {
        return {
          ...node,
          data: {
            ...node.data,
            property: {
              ...node.data?.property,
              [key]: value
            },
          },
        }
      }
      return node
    })
    setNodes(newNodes)
    await saveFlow(newNodes, edges)
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

      if (nodes.find((item) => extension.name === item.data.name)) {
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
        return logger.warn(
          `Handle:${handleName} not found in node:${targetNodeName}`,
        )
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
        return logger.warn(
          `Handle:${handleName} not found in node:${targetNodeName}`,
        )
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

  const onConnect = (params: Connection) => {
    logger.debug("onConnect", params)
    const customEdge = getConnectableEdge(params, connectDirection, nodes)
    if (customEdge) {
      setEdges((eds) => addEdge(customEdge, eds))
    }
  }

  const onConnectEnd = () => {
    logger.debug("onConnectEnd")
    setNodes(resetNodesStatus(nodes))
  }

  // ------------------ Delete ------------------
  const onDelete = async (elements: { nodes: ExtensionNode[]; edges: CustomEdge[] }) => {
    const { nodes, edges } = elements
    logger.debug("onDelete", nodes, edges)
    nodes.forEach(node => {
      const { data } = node
      editorData.delNode(data.extensionGroup, data.name)
    })
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
        onDelete={onDelete}
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
