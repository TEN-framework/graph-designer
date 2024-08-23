import { expect, test } from 'vitest'
import { EditorData } from "@/common"
import { describe } from 'node:test'

const testEditorData = new EditorData()

describe('editorData', () => {
  test('genNodeId', () => {
    expect(testEditorData.genNodeId()).toBe('1')
    expect(testEditorData.genNodeId()).toBe('2')
  })
  test('genEdgeId', () => {
    expect(testEditorData.genEdgeId()).toBe('1')
    expect(testEditorData.genEdgeId()).toBe('2')
  })
  test('saveNodeId', () => {
    testEditorData.saveNodeId('group1', 'ext1', 'node1')
    expect(testEditorData.nodeMap.get('group1')?.ext1).toBe('node1')
  })
  test('getNodeId', () => {
    expect(testEditorData.getNodeId('group1', 'ext1')).toBe('node1')
  })
  test('delNode', () => {
    testEditorData.delNode('group1', 'ext1')
    expect(testEditorData.nodeMap.get('group1')?.ext1).toBe(undefined)
  })

})
