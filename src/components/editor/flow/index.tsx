import { useCallback, useMemo, useEffect, useState } from "react"
import type { MouseEvent, TouchEvent } from 'react';
import ReactFlow, {
  Connection,
  ConnectionLineType,
  ReactFlowProvider,
  EdgeChange,
  useEdges,
  MarkerType,
  useNodes,
  useNodesState,
  useReactFlow,
  useEdgesState,
  Node,
  Edge,
  addEdge,
  Controls,
  Background,
  OnConnectStartParams,
  NodeTypes,
} from "reactflow"
import type { ComponentType } from 'react';
import ExtensionNode from "./nodes/extension"
import { message } from 'antd';
import {
  useAppSelector, apiGetGraphExtension, connectionsToEdges, extensionToNode,
  apiGetGraphConnection, extensionsToNodes, apiQueryCompatibleMessage,
  handleIdToType
} from "@/common"
import { IExtension, ICompatibleConnection, IExtensionNode, CustomNodeType } from "@/types"

// const initialNodes: Node[] = [
//   {
//     id: "agora_rtc",
//     type: "extension",
//     data: {
//       name: "agora_rtc",
//       inputs: [
//         { id: "text_data", type: "string" },
//         { id: "flush", type: "string" },
//         { id: "pcm", type: "audio_pcm" },
//       ],
//       outputs: [{ id: "text_data", type: "string" }],
//     },
//     position: { x: 0, y: 5 },
//   },
//   {
//     id: "openai_chatgpt",
//     type: "extension",
//     data: {
//       name: "openai_chatgpt",
//       inputs: [
//         { id: "flush", type: "string" },
//         { id: "text_data", type: "string" },
//       ],
//       outputs: [
//         { id: "flush", type: "string" },
//         { id: "text_data", type: "string" },
//       ],
//     },
//     position: { x: 600, y: 5 },
//   },
//   {
//     id: "azure_tts",
//     type: "extension",
//     data: {
//       name: "azure_tts",
//       inputs: [
//         { id: "flush", type: "string" },
//         { id: "text_data", type: "string" },
//       ],
//       outputs: [
//         { id: "flush", type: "string" },
//         { id: "pcm", type: "audio_pcm" },
//       ],
//     },
//     position: { x: 900, y: -200 },
//   },
//   {
//     id: "interrupt_detector",
//     type: "extension",
//     data: {
//       name: "interrupt_detector",
//       inputs: [{ id: "text_data", type: "string" }],
//       outputs: [
//         { id: "flush", type: "string" },
//         { id: "text_data", type: "string" },
//       ],
//     },
//     position: { x: 300, y: 5 },
//     // className: styles.customNode,
//   },
//   {
//     id: "chat_transcriber",
//     type: "extension",
//     data: {
//       name: "chat_transcriber",
//       inputs: [{ id: "text_data", type: "string" }],
//       outputs: [{ id: "text_data", type: "string" }],
//     },
//     position: { x: 900, y: 200 },
//     // className: styles.customNode,
//   },
// ]

// const initialEdges: Edge[] = [
//   { id: '1', source: 'agora_rtc', sourceHandle: "agora_rtc/text_data", target: 'interrupt_detector', targetHandle: 'interrupt_detector/text_data' },
//   { id: '2', source: 'interrupt_detector', sourceHandle: "interrupt_detector/flush", target: 'openai_chatgpt', targetHandle: 'openai_chatgpt/flush' },
//   { id: '3', source: 'interrupt_detector', sourceHandle: "interrupt_detector/text_data", target: 'openai_chatgpt', targetHandle: 'openai_chatgpt/text_data' },
//   { id: '4', source: 'openai_chatgpt', sourceHandle: "openai_chatgpt/flush", target: 'azure_tts', targetHandle: 'azure_tts/flush' },
//   { id: '5', source: 'openai_chatgpt', sourceHandle: "openai_chatgpt/text_data", target: 'azure_tts', targetHandle: 'azure_tts/text_data' },
//   { id: '6', source: 'openai_chatgpt', sourceHandle: "openai_chatgpt/text_data", target: 'chat_transcriber', targetHandle: 'chat_transcriber/text_data' },
//   { id: '7', source: 'azure_tts', sourceHandle: "azure_tts/flush", target: 'agora_rtc', targetHandle: 'agora_rtc/flush' },
//   { id: '8', source: 'azure_tts', sourceHandle: "azure_tts/pcm", target: 'agora_rtc', targetHandle: 'agora_rtc/pcm' },
//   { id: '9', source: 'chat_transcriber', sourceHandle: "chat_transcriber/text_data", target: 'agora_rtc', targetHandle: 'agora_rtc/text_data' },
// ]

// const defaultEdgeOptions = {
//   // animated: true,
//   // type: 'smoothstep',
// };

const defaultEdgeOptions = {
  // style: { strokeWidth: 3, stroke: 'black' },
  type: "smoothstep",
  // type: 'bezier',
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

const Flow = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const curGraphName = useAppSelector((state) => state.global.curGraphName)
  const { screenToFlowPosition } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [extensions, setExtensions] = useState<IExtension[]>([])

  useEffect(() => {
    if (curGraphName) {
      getData()
    }
  }, [curGraphName])



  const getData = async () => {
    const extensions = await apiGetGraphExtension(curGraphName)
    setExtensions(extensions)
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
      const name = event.dataTransfer.getData("name")

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }

      if (nodes.find((item) => item.id === name)) {
        return messageApi.error(`Extension ${name} already exists editor`)
      }

      const targetExtension = extensions.find((item) => item.name === name)
      if (!targetExtension) {
        return messageApi.error(`Extension ${name} not found`)
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = extensionToNode(targetExtension, {
        position
      })

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, extensions, nodes],
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
    // TODO: highlight the node if can connect
    // TODO: if connection break off, reset status  (onConnectEnd)
    const { handleId = "", nodeId, handleType } = params
    const handleName = handleId?.split("/")[1]
    const targetExtension = extensions.find((item) => item.name === nodeId)
    const targetNode = nodes.find((item) => item.id === nodeId)
    console.log("onConnectStart", event, params, targetExtension, targetNode)

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
    } else if (handleType == "target") {
      options.msg_direction = "in"
      const inputs = targetNode?.data.inputs ?? []
      const target = inputs.find((item: any) => item.id === handleName)
      options.msg_type = target!.type
      options.msg_name = target!.id
    }
    const connections = await apiQueryCompatibleMessage(options)
    highlightNode(connections)

    console.log("onConnectStart compatible connection", connections)
  }

  const onConnect = useCallback(
    (params: Connection | Edge) => {

      console.log("onConnect", params)

      // TODO: judge if can connect
      // if not, return false
      const { source, target, sourceHandle, targetHandle } = params

      setEdges((eds) => {
        return addEdge(params, eds)
      })

    },
    [setEdges],
  )


  const onConnectEnd = () => {
    console.log("onConnectEnd")
  }


  // ------------------ Other ------------------
  const highlightNode = (connections: ICompatibleConnection[]) => {
    console.log("highlightNode", connections)
    let newNodes: Node[] = []
    if (connections.length) {
      // set enabled/disabled  status
      newNodes = nodes.map((node) => {
        const targetConnection = connections.find((c) => c.extension == node.id)
        let data = node.data
        let { inputs, outputs } = data
        if (targetConnection) {
          const isIn = targetConnection.msg_direction == "in"
          inputs = inputs.map((input: any) => {
            return {
              ...input,
              status: input.id == targetConnection.msg_name && isIn ? "enabled" : "disabled"
            }
          })
          outputs = outputs.map((output: any) => {
            return {
              ...output,
              status: output.id == targetConnection.msg_name && !isIn ? "enabled" : "disabled"
            }
          })
        } else {
          inputs = inputs.map((input: any) => {
            return {
              ...input,
              status: "disabled"
            }
          })
          outputs = outputs.map((output: any) => {
            return {
              ...output,
              status: "disabled"
            }
          })
        }

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
    } else {
      // reset default status
      // newNodes
    }
    console.log("highlightNode newNodes", newNodes)
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
      // connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Controls />
        <Background></Background>
      </ReactFlow>
    </>

  )
}

export default Flow
