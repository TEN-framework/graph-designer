import { memo, useCallback, useMemo, FC } from "react"
import { Handle, Position, Node, NodeProps, } from "reactflow"
import { NodeStatus, IExtensionNode } from "@/types"

import styles from "./extension.module.scss"

const HEADER_HEIGHT = 30
const HANDLE_HEIGHT = 20


const getHandlerColor = (status?: NodeStatus) => {
  if (status == "default") {
    return "#555"
  } else if (status == "disabled") {
    return "##bbbbbb"
  } else if (status == "enabled") {
    return "#58de7b"
  }
  return "#555"
}

export default function ExtensionNode({ data }: IExtensionNode) {

  const {
    name,
    inputs = [],
    outputs = [],
    status = "default"
  } = data


  return <div
    className={`${styles["extension-node"]} ${status}`}
    style={{
      height:
        HEADER_HEIGHT +
        HANDLE_HEIGHT * Math.max(inputs.length, outputs.length),
    }}
  >
    <div className={styles["contents"]}>
      <div className={styles["extension-name"]}>
        <strong>{name}</strong>
      </div>
      <div className={styles["extension-inputs"]}>
        {inputs.map((input, index) => (
          <Handle
            key={`${name}/${input.id}`}
            type="target"
            position={Position.Left}
            id={`${name}/${input.id}`}
            style={{
              top: HEADER_HEIGHT + HANDLE_HEIGHT * index,
              background: getHandlerColor(input.status),
            }}
          >
            <div className={styles["extension-handle-label"]}>
              {input.id}
            </div>
          </Handle>
        ))}
      </div>
      <div className={styles["extension-outputs"]}>
        {outputs.map((output, index) => (
          <Handle
            key={`${name}/${output.id}`}
            type="source"
            position={Position.Right}
            id={`${name}/${output.id}`}
            style={{
              top: HEADER_HEIGHT + HANDLE_HEIGHT * index,
              background: getHandlerColor(output.status),
            }}
          >
            <div className={styles["extension-handle-label"]}>
              {output.id}
            </div>
          </Handle>
        ))}
      </div>
    </div>
  </div>

}


