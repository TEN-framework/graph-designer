import { useCallback, useMemo, useEffect, useState, ComponentType } from "react"
import type { MouseEvent, TouchEvent } from 'react';
import ReactFlow, {
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
  NodeTypes,
  EdgeTypes,
  DefaultEdgeOptions,
} from "reactflow"
import ExtensionNode from "./nodes/extension"
import { message } from 'antd';
import {
  useAppSelector, apiGetGraphExtension, connectionsToEdges, extensionToNode,
  apiGetGraphConnection, extensionsToNodes, apiQueryCompatibleMessage,
  handleIdToType
} from "@/common"
import { IExtension, ICompatibleConnection, ConnectDirection, InOutData } from "@/types"


const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  // stroke: 'black' 
  style: { strokeWidth: 1.5, },
  type: "smoothstep",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    // color: 'red',
  },
}
const initialNodes: Node[] = []
const initialEdges: Edge[] = []
const nodeTypes: any = {
  extension: ExtensionNode
}
const edgeTypes: any = {
  // animated: true,
  // pathOptions: {
  //   offset: 30,
  //   borderRadius: 100
  // },
}

let connectDirection = ConnectDirection.Positive

const Flow = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const curGraphName = useAppSelector((state) => state.global.curGraphName)
  const installedExtensions = useAppSelector((state) => state.global.installedExtensions)
  const { screenToFlowPosition } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    if (curGraphName) {
      getData()
    }
  }, [curGraphName])



  const getData = async () => {
    const extensions = await apiGetGraphExtension(curGraphName)
    console.log("graph extensions", extensions)
    const nodes = extensionsToNodes(extensions)
    console.log("graph nodes", nodes)
    setNodes(nodes)

    const connections = await apiGetGraphConnection(curGraphName)
    console.log("graph connections", connections)

    const edges = connectionsToEdges(connections)
    console.log("edges", edges)
    setEdges(edges)
  }

  // ----------------- Drag and Drop -----------------
  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault()
      const type = event.dataTransfer.getData("type")
      const extension: IExtension = JSON.parse(event.dataTransfer.getData("extension"))

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }
      
      if (nodes.find((item) => extension.name === item.id)) {
        return messageApi.error(`Extension ${extension.name} already exists editor`)
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = extensionToNode(extension, {
        position
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
    const { handleId = "", nodeId, handleType } = params
    const handleName = handleId?.split("/")[1]
    const targetExtension = installedExtensions.find((item) => item.name === nodeId)
    const targetNode = nodes.find((item) => item.id === nodeId)
    console.log("onConnectStart", params)
    console.log("onConnectStart targetExtension", targetExtension)
    console.log("onConnectStart targetNode", targetNode)

    const options: ICompatibleConnection = {
      app: targetExtension?.app ?? "",
      graph: curGraphName,
      extension_group: targetExtension?.extension_group ?? "",
      extension: targetExtension?.name ?? "",
      msg_type: "",
      msg_name: "",
      msg_direction: ""
    }
    if (handleType == "source") {
      const outputs = targetNode?.data.outputs ?? []
      const target = outputs.find((item: any) => item.id === handleName)
      options.msg_direction = 'out'
      options.msg_type = target!.type
      options.msg_name = target!.id
      connectDirection = ConnectDirection.Positive
    } else if (handleType == "target") {
      options.msg_direction = "in"
      const inputs = targetNode?.data.inputs ?? []
      const target = inputs.find((item: any) => item.id === handleName)
      options.msg_type = target!.type
      options.msg_name = target!.id
      connectDirection = ConnectDirection.Negative
    }
    const connections = await apiQueryCompatibleMessage(options)
    highlightNodes(connections)

    console.log("onConnectStart compatible connection", connections)
  }

  const onConnect = (params: Connection | Edge) => {
    console.log("onConnect 1121", params)
    const { source, target, sourceHandle, targetHandle } = params
    const arr = targetHandle?.split("/") ?? []
    const targetNodeName = arr[0]
    const targetHandleName = arr[1]
    if (targetNodeName && targetHandleName) {
      const targetNode = nodes.find((item) => item.id === targetNodeName)
      if (targetNode?.data.status == "enabled") {
        let targetHandler
        if (connectDirection == ConnectDirection.Positive) {
          const arr: InOutData[] = targetNode?.data.inputs ?? []
          targetHandler = arr.find(item => item.id == targetHandleName && item.status == "enabled")
        } else {
          const arr: InOutData[] = targetNode?.data.outputs ?? []
          targetHandler = arr.find(item => item.id == targetHandleName && item.status == "enabled")
        }
        if (targetHandler) {
          setEdges((eds) => {
            return addEdge(params, eds)
          })
        }
      }
    }
  }


  const onConnectEnd = () => {
    console.log("onConnectEnd")
    resetNodeStatus()
  }


  // ------------------ Other ------------------
  const highlightNodes = (connections: ICompatibleConnection[]) => {
    console.log("highlightNodes", connections)
    if (connections.length) {
      // set enabled/disabled  status
      let newNodes = nodes.map((node) => {
        const targetConnection = connections.find((c) => c.extension == node.id)
        let data = node.data
        let { inputs, outputs } = data
        const isIn = targetConnection?.msg_direction == "in"
        const isOut = targetConnection?.msg_direction == "out"
        inputs = inputs.map((input: any) => {
          return {
            ...input,
            status: targetConnection && input.id == targetConnection.msg_name && isIn ? "enabled" : "disabled"
          }
        })
        outputs = outputs.map((output: any) => {
          return {
            ...output,
            status: targetConnection && output.id == targetConnection.msg_name && isOut ? "enabled" : "disabled"
          }
        })
        return {
          ...node,
          data: {
            ...data,
            inputs,
            outputs,
            status: targetConnection ? "enabled" : "disabled",
          }
        }
      })
      console.log("highlightNodes newNodes", newNodes)
      setNodes(newNodes)
    } else {
      // reset default status
      resetNodeStatus()
    }
  }

  const resetNodeStatus = () => {
    const newNodes = nodes.map((node) => {
      return {
        ...node,
        data: {
          ...node.data,
          status: "default",
          inputs: node.data.inputs.map((input: any) => {
            return {
              ...input,
              status: "default"
            }
          }),
          outputs: node.data.outputs.map((output: any) => {
            return {
              ...output,
              status: "default"
            }
          })
        }
      }
    })
    setNodes(newNodes)
  }

  return (
    <>
      {contextHolder}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onConnectStart={onConnectStart}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        defaultEdgeOptions={defaultEdgeOptions}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Controls />
        <Background></Background>
      </ReactFlow>
    </>

  )
}

export default Flow
