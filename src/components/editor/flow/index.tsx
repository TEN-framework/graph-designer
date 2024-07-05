import { useCallback, useMemo } from "react"
import ReactFlow,
{
  Connection, ConnectionLineType, ReactFlowProvider, EdgeChange, useEdges, MarkerType,
  useNodes, useNodesState, useEdgesState, Node, Edge, addEdge, Controls, Background,
} from 'reactflow'
import ExtensionNode from "./nodes/extension";

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'extension',
    data: { 
      name: 'openai_chatgpt',
      cmd_inputs:[{id:"text_in", type: "string"},{id:"text_in2", type: "string"}],
      cmd_outputs:[{id:"text_out", type: "string"},{id:"text_out2", type: "string"}]
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    type: 'default',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'default',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    // className: styles.customNode,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

// const defaultEdgeOptions = {
//   // animated: true,
//   // type: 'smoothstep',
// };


const defaultEdgeOptions = {
  // style: { strokeWidth: 3, stroke: 'black' },
  // type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    // color: 'red',
  },
};

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({ extension: ExtensionNode }), []);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );


  return <ReactFlow
    nodes={nodes}
    edges={edges}
    onEdgesChange={onEdgesChange}
    onNodesChange={onNodesChange}
    onConnect={onConnect}
    defaultEdgeOptions={defaultEdgeOptions}
    nodeTypes={nodeTypes}
    // connectionLineType={ConnectionLineType.SmoothStep}
  >
    <Controls />
    <Background></Background>
  </ReactFlow>
}

export default Flow;
