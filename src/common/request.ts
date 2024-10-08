import {
  IConnection,
  IExtension,
  ICompatibleConnection,
  IGraphData,
} from "@/types"
import { DEFAULT_EXTENTION_GROUP, API_URL, USE_MOCK } from "./constant"
import { MOCK_CONNECTIONS, MOCK_EXTENTIONS, MOCK_INSTALLED_EXTENTIONS } from "./mock"

export const apiGetVersion = async () => {
  if (USE_MOCK) {
    return {
      version: "mock"
    }
  }
  const res = await fetch(`${API_URL}/version`, {
    method: "GET",
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error(data.message)
  }
  return data?.data ?? {}
}

export const apiGetInstalledExtension = async () => {
  if (USE_MOCK) {
    return MOCK_INSTALLED_EXTENTIONS
  }
  const res = await fetch(`${API_URL}/addons/extensions`, {
    method: "GET",
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error(data.message)
  }
  let arr = data?.data ?? []

  return arr.map((item: IExtension) => {
    return {
      ...item,
      addon: item.name, // addon like class name
      app: "localhost",
      extension_group: DEFAULT_EXTENTION_GROUP,
      property: null,
    }
  })
}

export const apiAllGetGraph = async () => {
  if (USE_MOCK) {
    return [{
      auto_start: true,
      name: "mock_graph",
    }]
  }
  const res = await fetch(`${API_URL}/graphs`, {
    method: "GET",
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error(data.message)
  }
  return data?.data ?? []
}

export const apiGetGraphExtension = async (
  graphName: string,
): Promise<IExtension[]> => {
  if (USE_MOCK) {
    return MOCK_EXTENTIONS
  }
  const res = await fetch(`${API_URL}/graphs/${graphName}/nodes`, {
    method: "GET",
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error(data.message)
  }
  return (data?.data ?? []) as IExtension[]
}

export const apiGetGraphConnection = async (
  graphName: string,
): Promise<IConnection[]> => {
  if (USE_MOCK) {
    return MOCK_CONNECTIONS
  }
  const res = await fetch(`${API_URL}/graphs/${graphName}/connections`, {
    method: "GET",
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error(data.message)
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
    throw new Error(data.message)
  }
  return data
}

export const apiSaveGraph = async () => {
  const res = await fetch(`${API_URL}/property`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await res.json()
  if (data.status != "ok") {
    throw new Error(data.message)
  }
  return data
}
