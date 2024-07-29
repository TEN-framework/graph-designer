import { message } from "antd"
import { camelToSnake } from "./utils"
import {
  IConnection,
  IExtension,
  ICompatibleConnection,
  IGraphData,
} from "@/types"
import { DEFAULT_EXTENTION_GROUP, API_URL } from "./constant"

export const apiGetVersion = async () => {
  const res = await fetch(`${API_URL}/version`, {
    method: "GET",
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error("Failed to get version")
  }
  return data?.data ?? {}
}

export const apiGetInstalledExtension = async () => {
  const res = await fetch(`${API_URL}/addons/extensions`, {
    method: "GET",
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error("Failed to get installed extensions")
  }
  let arr = data?.data ?? []

  return arr.map((item: IExtension) => {
    return {
      ...item,
      addon: item.name,
      app: "localhost",
      extension_group: DEFAULT_EXTENTION_GROUP,
      property: null,
    }
  })
}

export const apiAllGetGraph = async () => {
  const res = await fetch(`${API_URL}/graphs`, {
    method: "GET",
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error("Failed to get all graphs")
  }
  return data?.data ?? []
}

export const apiGetGraphExtension = async (
  graphName: string,
): Promise<IExtension[]> => {
  const res = await fetch(`${API_URL}/graphs/${graphName}/extensions`, {
    method: "GET",
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error("Failed to get graph extensions")
  }
  return (data?.data ?? []) as IExtension[]
}

export const apiGetGraphConnection = async (
  graphName: string,
): Promise<IConnection[]> => {
  const res = await fetch(`${API_URL}/graphs/${graphName}/connections`, {
    method: "GET",
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error("Failed to get graph connections")
  }
  return (data?.data ?? []) as IConnection[]
}

export const apiQueryCompatibleMessage = async (
  options: ICompatibleConnection,
): Promise<ICompatibleConnection[]> => {
  const res = await fetch(`${API_URL}/messages/compatible`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
    method: "POST",
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error(data.message)
  }
  let arr = data?.data ?? []
  return arr as ICompatibleConnection[]
}

export const apiUpdateGraph = async (
  graphName: string,
  graphData: IGraphData,
) => {
  const res = await fetch(`${API_URL}/graphs/${graphName}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(graphData),
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error("Failed to update graph")
  }
  return data
}

export const apiSaveGraph = async () => {
  const res = await fetch(`${API_URL}/manifest`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error("Failed to save graph")
  }
  return data
}
