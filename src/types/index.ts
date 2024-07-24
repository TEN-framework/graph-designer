import type { Node, BuiltInNode } from "@xyflow/react"

// ------------------ enum  ------------------
export enum LogLevel {
  DEBUG = 0,
  WARN = 1,
  ERROR = 2,
}

export enum ConnectDirection {
  Positive = "positive", // out hander => in handler
  Negative = "negative", // in handler => out handler
}

// ------------------ type  ------------------
export type MsgType = "cmd" | "data" | "img_frame" | "pcm_frame"
export type NodeStatus = "default" | "disabled" | "enabled"
export type SaveStatus = "idle" | "saving" | "success" | "failed"
export type IExtensionNode = Node<
  {
    name: string
    status?: NodeStatus
    extensionGroup?: string
    inputs: InOutData[]
    outputs: InOutData[]
  },
  "extension"
>
export type CustomNodeType = BuiltInNode | IExtensionNode

// ------------------ interface  ------------------
export interface IExtension {
  name: string
  addon: string
  api?: {
    cmd_in?: any[]
    cmd_out?: any[]
    data_in?: any[]
    data_out?: any[]
    pcm_frame_in?: any[]
    pcm_frame_out?: any[]
    img_frame_in?: any[]
    img_frame_out?: any[]
    [propName: string]: any
  }
  app?: string
  extension_group?: string
  property?: any
}

export interface IConnectionData {
  name: string
  dest: any[]
}

export interface IConnection {
  app: string
  data?: IConnectionData[]
  cmd?: IConnectionData[]
  pcm_frame?: IConnectionData[]
  img_frame?: IConnectionData[]
  extension: string
  extension_group: string
}

export interface IGraph {
  auto_start: boolean
  name: string
}

export interface IGraphData {
  auto_start: boolean
  extensions: IExtension[]
  connections: IConnection[]
}

export interface ICompatibleConnection {
  app: string
  graph: string
  extension_group: string
  extension: string
  msg_type: string
  msg_direction: string
  msg_name: string
}

export interface InOutData {
  id: string
  type: MsgType
  status?: NodeStatus
}
