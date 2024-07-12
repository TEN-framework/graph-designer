import { camelToSnake } from "./utils"
import { IConnection, IExtension, ICompatibleConnection } from "@/types"


const BASE_URL = "http://localhost:49483"
const PREFIX = "/api/dev-server/v1"
const API_URL = `${BASE_URL}${PREFIX}`

export const apiGetVersion = async () => {
  return fetch(`${API_URL}/version`, {
    method: "GET",
  }).then((res) => res.json())
}

export const apiGetInstalledExtension = async () => {
  return fetch(`${API_URL}/addons/extensions`, {
    method: "GET",
  }).then((res) => res.json())
}

export const apiAllGetGraph = async () => {
  return fetch(`${API_URL}/graphs`, {
    method: "GET",
  }).then((res) => res.json())
}

export const apiGetGraphExtension = async (graphName: string): Promise<IExtension[]> => {
  const res = await fetch(`${API_URL}/graphs/${graphName}/extensions`, {
    method: "GET",
  })
  const data = await res.json()
  return data as IExtension[]
}

export const apiGetGraphConnection = async (graphName: string): Promise<IConnection[]> => {
  const res = await fetch(`${API_URL}/graphs/${graphName}/connections`, {
    method: "GET",
  })
  const data = await res.json()
  return data as IConnection[]
}

export const apiQueryCompatibleMessage = async (options: ICompatibleConnection): Promise<ICompatibleConnection[]> => {
  const res = await fetch(`${API_URL}/messages/compatible`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
    method: "POST",
  })
  const data = await res.json()
  for (const item of data) {
    item.msg_direction = camelToSnake(item.msg_direction)
    item.msg_type = camelToSnake(item.msg_type)
  }
  return data as ICompatibleConnection[]
}

export const updateGraph = async (graphName: string, graph: any) => {
  return fetch(`${API_URL}/graphs/${graphName}`, {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
    },
    body: JSON.stringify(graph),
  }).then((res) => res.json())
}
