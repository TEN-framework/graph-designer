const BASE_URL = 'http://localhost:49483';
const PREFIX = '/api/dev-server/v1';
const API_URL = `${BASE_URL}${PREFIX}`;

export const apiGetVersion = async () => {
  return fetch(`${API_URL}/version`, {
    method: 'GET',
  }).then((res) => res.json());
}


export const apiGetExtensionAddons = async () => {
  return fetch(`${API_URL}/addons/extensions`, {
    method: 'GET',
  }).then((res) => res.json())
}


export const apiGetGraph = async () => {
  return fetch(`${API_URL}/graphs`, {
    method: 'GET',
  }).then((res) => res.json())
}


export const apiGetGraphExtensions = async (graphName: string) => {
  return fetch(`${API_URL}/graphs/${graphName}/extensions`, {
    method: 'GET',
  }).then((res) => res.json())
}


export const apiGetGraphConnections = async (graphName: string) => { 
  return fetch(`${API_URL}/graphs/${graphName}/connections`, {
    method: 'GET',
  }).then((res) => res.json())
}


export const apiGetCompatibleMessage = async () => {
  return fetch(`${API_URL}/messages/compatible`, {
    method: 'GET',
  }).then((res) => res.json())
}


export const updateGraph = async (graphName: string, graph: any) => {
  return fetch(`${API_URL}/graphs/${graphName}`, 
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graph),
  }).then((res) => res.json())
}
