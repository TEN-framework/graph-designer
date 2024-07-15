import type { Node, NodeProps } from 'reactflow';

// ------------------ enum  ------------------
export enum LogLevel {
  DEBUG = 0,
  WARN = 1,
  ERROR = 2,
}

export enum ConnectDirection {
  IN2OUT = "in-out",
  OUT2IN = "out-in",
}

// ------------------ type  ------------------
export type MsgType = "cmd" | "data" | "img_frame" | "pcm_frame"
export type NodeStatus = "default" | "disabled" | "enabled"
export type IExtensionNode = Node<{
  name: string
  status?: NodeStatus
  inputs: InOutData[]
  outputs: InOutData[]
}, 'extension'>;
export type CustomNodeType = IExtensionNode


// ------------------ interface  ------------------
export interface IExtension {
  name: string
  addon?: string
  api?: {
    cmd_in?: any[]
    cmd_out?: any[]
    data_in?: any[]
    data_out?: any[]
    pcm_frame_in?: any[]
    pcm_frame_out?: any[]
    img_frame_in?: any[]
    img_frame_out?: any[]
    [propName: string]: any;
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
  app: string,
  data?: IConnectionData[]
  cmd?: IConnectionData[]
  pcm_frame?: IConnectionData[]
  extension: string
  extension_group: string,
}

export interface IGraph {
  auto_start: boolean,
  name: string
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




