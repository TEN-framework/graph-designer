export enum LogLevel {
  DEBUG = 0,
  WARN = 1,
  ERROR = 2,
}


export interface IExtension {
  name: string
  addon?: string
  app?: string
  extension_group?: string
  property?:any
}


export interface IGraph {
  auto_start: boolean,
  name: string
}
