import { memo, useCallback, useMemo, FC } from "react"
import { Handle, Position, Node, NodeProps, } from "reactflow"
import { NodeStatus, IExtensionNode } from "@/types"
import { Input } from 'antd'

import styles from "./extension.module.scss"

const HANDLE_HEIGHT = 40

const getHandlerColor = (status?: NodeStatus) => {
  if (status == "disabled") {
    return "#ff1e1e"
  } else if (status == "enabled") {
    return "#58de7b"
  }
  // default
  return "#31a3cc"
}

const getNodeColor = (status?: NodeStatus) => {
  if (status == "disabled") {
    return "#ff1e1e"
  } else if (status == "enabled") {
    return "#38ff1e"
  }

  return "#E5E7EB"
}

export default function ExtensionNode({ data }: IExtensionNode) {

  const {
    name,
    inputs = [],
    outputs = [],
    status = "default"
  } = data

  const maxLen = Math.max(inputs.length, outputs.length)

  return <div
    className={styles.extensionNode}
    style={{
      borderColor: getNodeColor(status),
    }}
  >
    <div className={styles.extensionName}>
      <span className={styles.text}>{name}</span>
    </div>
    <div className={styles.extensionGroup}>
      <div className={styles.title}>extensionGroup</div>
      <Input value="default"></Input>
    </div>
    {
      maxLen ? <div className={styles.extensionHandleWrapper} style={{
        height: HANDLE_HEIGHT * maxLen + "px"
      }}>
        {inputs.map((input, index) => (
          <div
            key={`${name}/${input.id}`}
            className={`${styles.extensionHandleItem} ${styles.leftItem}`}
            style={{
              top: index * HANDLE_HEIGHT + "px",
              height: HANDLE_HEIGHT + "px",
            }}>
            <Handle
              type="target"
              className={styles.handle}
              position={Position.Left}
              id={`${name}/${input.id}`}
              style={{
                borderColor: getHandlerColor(input.status),
              }}
            >
            </Handle>
            <span className={styles.text}>
              {input.id}
            </span>
          </div>
        ))}
        {outputs.map((output, index) => (
          <div
            key={`${name}/${output.id}`}
            className={`${styles.extensionHandleItem} ${styles.rightItem}`}
            style={{
              top: index * HANDLE_HEIGHT + "px",
              height: HANDLE_HEIGHT + "px",
            }}>
            <Handle
              className={styles.handle}
              type="source"
              position={Position.Right}
              id={`${name}/${output.id}`}
              style={{
                borderColor: getHandlerColor(output.status),
              }}
            ></Handle>
            <span className={styles.text}>
              {output.id}
            </span>
          </div>
        ))}
      </div> : null
    }
  </div >

}


