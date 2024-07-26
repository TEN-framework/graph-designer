import { useRef, useState, useEffect } from "react"
import { Handle, Position, Node, NodeProps } from "@xyflow/react"
import { eventManger } from "@/manager"
import { NodeStatus, IExtensionNode } from "@/types"
import { Input } from "antd"

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

export default function ExtensionNode(props: NodeProps<IExtensionNode>) {
  const { data } = props
  const {
    name,
    inputs = [],
    outputs = [],
    status = "default",
    extensionGroup: propExtensionGroup = "default",
  } = data
  const maxLen = Math.max(inputs.length, outputs.length)
  const [extensionGroup, setExtensionGroup] = useState(propExtensionGroup)
 
  // TODO: max (left, right) handle width
  // const refLeftList = useRef([]);


  const onInputBlur = () => {
    eventManger.emit("extentionGroupChanged", name, extensionGroup)
  }

  return (
    <div
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
        <Input
          value={extensionGroup}
          onChange={(e) => setExtensionGroup(e.target.value)}
          onBlur={onInputBlur}
        ></Input>
      </div>
      {maxLen ? (
        <div
          className={styles.extensionHandleWrapper}
          style={{
            height: HANDLE_HEIGHT * maxLen + "px",
          }}
        >
          {inputs.map((input, index) => (
            <div
              key={index}
              className={`${styles.extensionHandleItem} ${styles.leftItem}`}
              style={{
                top: index * HANDLE_HEIGHT + "px",
                height: HANDLE_HEIGHT + "px",
              }}
            >
              <Handle
                type="target"
                className={styles.handle}
                position={Position.Left}
                id={input.name}
                style={{
                  borderColor: getHandlerColor(input.status),
                }}
              ></Handle>
              <span className={styles.text}>{input.name}</span>
            </div>
          ))}
          {outputs.map((output, index) => (
            <div
              key={index}
              className={`${styles.extensionHandleItem} ${styles.rightItem}`}
              style={{
                top: index * HANDLE_HEIGHT + "px",
                height: HANDLE_HEIGHT + "px",
              }}
            >
              <Handle
                className={styles.handle}
                type="source"
                position={Position.Right}
                id={output.name}
                style={{
                  borderColor: getHandlerColor(output.status),
                }}
              ></Handle>
              <span className={styles.text}>{output.name}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
