import { Node, Edge } from "reactflow"

export const  mockInitialNodes: Node[] = [
  {
    id: "agora_rtc",
    type: "extension",
    data: {
      name: "agora_rtc",
      inputs: [
        { id: "text_data", type: "string" },
        { id: "flush", type: "string" },
        { id: "pcm", type: "audio_pcm" },
      ],
      outputs: [{ id: "text_data", type: "string" }],
    },
    position: { x: 0, y: 5 },
  },
  {
    id: "openai_chatgpt",
    type: "extension",
    data: {
      name: "openai_chatgpt",
      inputs: [
        { id: "flush", type: "string" },
        { id: "text_data", type: "string" },
      ],
      outputs: [
        { id: "flush", type: "string" },
        { id: "text_data", type: "string" },
      ],
    },
    position: { x: 600, y: 5 },
  },
  {
    id: "azure_tts",
    type: "extension",
    data: {
      name: "azure_tts",
      inputs: [
        { id: "flush", type: "string" },
        { id: "text_data", type: "string" },
      ],
      outputs: [
        { id: "flush", type: "string" },
        { id: "pcm", type: "audio_pcm" },
      ],
    },
    position: { x: 900, y: -200 },
  },
  {
    id: "interrupt_detector",
    type: "extension",
    data: {
      name: "interrupt_detector",
      inputs: [{ id: "text_data", type: "string" }],
      outputs: [
        { id: "flush", type: "string" },
        { id: "text_data", type: "string" },
      ],
    },
    position: { x: 300, y: 5 },
    // className: styles.customNode,
  },
  {
    id: "chat_transcriber",
    type: "extension",
    data: {
      name: "chat_transcriber",
      inputs: [{ id: "text_data", type: "string" }],
      outputs: [{ id: "text_data", type: "string" }],
    },
    position: { x: 900, y: 200 },
    // className: styles.customNode,
  },
]

export const mockInitialEdges: Edge[] = [
  { id: '1', source: 'agora_rtc', sourceHandle: "agora_rtc/text_data", target: 'interrupt_detector', targetHandle: 'interrupt_detector/text_data' },
  { id: '2', source: 'interrupt_detector', sourceHandle: "interrupt_detector/flush", target: 'openai_chatgpt', targetHandle: 'openai_chatgpt/flush' },
  { id: '3', source: 'interrupt_detector', sourceHandle: "interrupt_detector/text_data", target: 'openai_chatgpt', targetHandle: 'openai_chatgpt/text_data' },
  { id: '4', source: 'openai_chatgpt', sourceHandle: "openai_chatgpt/flush", target: 'azure_tts', targetHandle: 'azure_tts/flush' },
  { id: '5', source: 'openai_chatgpt', sourceHandle: "openai_chatgpt/text_data", target: 'azure_tts', targetHandle: 'azure_tts/text_data' },
  { id: '6', source: 'openai_chatgpt', sourceHandle: "openai_chatgpt/text_data", target: 'chat_transcriber', targetHandle: 'chat_transcriber/text_data' },
  { id: '7', source: 'azure_tts', sourceHandle: "azure_tts/flush", target: 'agora_rtc', targetHandle: 'agora_rtc/flush' },
  { id: '8', source: 'azure_tts', sourceHandle: "azure_tts/pcm", target: 'agora_rtc', targetHandle: 'agora_rtc/pcm' },
  { id: '9', source: 'chat_transcriber', sourceHandle: "chat_transcriber/text_data", target: 'agora_rtc', targetHandle: 'agora_rtc/text_data' },
]
