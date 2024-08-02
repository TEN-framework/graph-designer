import { expect, test, describe } from 'vitest'
import { connectionsToEdges, MOCK_CONNECTIONS, extensionsToNodes, MOCK_EXTENTIONS, edgesToConnections } from "@/common"
import type { CustomEdge } from "@/types"

let edges: CustomEdge[]
const nodes = extensionsToNodes(MOCK_EXTENTIONS)

describe("connection and edge convert each other", () => {

  test('connections to edges', () => {
    edges = connectionsToEdges(MOCK_CONNECTIONS, nodes)
    expect(edges).toMatchSnapshot();
  })

  test('edges to connections', () => {
    const connections = edgesToConnections(edges, nodes)
    expect(connections).toMatchSnapshot();
  })


})

