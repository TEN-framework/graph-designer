import { expect, test, describe } from 'vitest'
import { MOCK_EXTENTIONS, extensionsToNodes, nodesToExtensions, MOCK_INSTALLED_EXTENTIONS } from "@/common"
import type { ExtensionNode } from "@/types"

let nodes: ExtensionNode[]

describe("extension and node convert each other", () => {

  test('extensions to nods', () => {
    nodes = extensionsToNodes(MOCK_EXTENTIONS)
    expect(nodes).toMatchSnapshot();
  })

  test('nodes to extensions', () => {
    const extensions = nodesToExtensions(nodes, MOCK_INSTALLED_EXTENTIONS)
    expect(extensions).toMatchSnapshot();
  })


})



