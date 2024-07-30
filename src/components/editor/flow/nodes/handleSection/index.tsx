import { useEffect, useRef } from "react"
import { DEFAULT_HANDLE_HEIGHT, DEFAULT_NODE_WIDTH } from "@/common"
import { InOutData, NodeStatus, } from "@/types"
import { Handle, Position, Node, NodeProps } from "@xyflow/react"
import styles from "./index.module.scss"

interface HandleSectionProps {
  inputs: InOutData[]
  outputs: InOutData[]
  onHandleWidthChange?: (width: number) => void
}

const getHandlerColor = (status?: NodeStatus) => {
  if (status == "disabled") {
    return "#ff1e1e"
  } else if (status == "enabled") {
    return "#58de7b"
  }
  // default
  return "#31a3cc"
}

const DEFAULT_HANDLE_GAP = 40

const HandleSection = (props: HandleSectionProps) => {
  const { inputs, outputs, onHandleWidthChange } = props
  const leftHandleListRef = useRef<Array<HTMLElement>>([])
  const rightHandleListRef = useRef<Array<HTMLElement>>([])
  const maxLen = Math.max(inputs.length, outputs.length)


  useEffect(() => {
    let width = DEFAULT_NODE_WIDTH

    for (let i = 0; i < maxLen; i++) {
      const leftHandle = leftHandleListRef.current[i]
      const rightHandle = rightHandleListRef.current[i]

      if (leftHandle && rightHandle) {
        const leftRealWidth =
          leftHandle.getElementsByTagName("span")[0]?.offsetWidth
        const rightRealWidth =
          rightHandle.getElementsByTagName("span")[0]?.offsetWidth
        const totalWidth = leftRealWidth + rightRealWidth
        if (totalWidth > width) {
          width = totalWidth
        }
      }
    }

    if (width > DEFAULT_NODE_WIDTH) {

    }



    if (width > DEFAULT_NODE_WIDTH) {
      width += DEFAULT_HANDLE_GAP
      onHandleWidthChange?.(width)
    }



  }, [
    leftHandleListRef.current.length,
    rightHandleListRef.current.length,
    maxLen,
  ])


  return <div
    className={styles.extensionHandleWrapper}
    style={{
      height: DEFAULT_HANDLE_HEIGHT * maxLen,
    }}
  >
    {inputs.map((input, index) => (
      <div
        key={index}
        className={`${styles.extensionHandleItem} ${styles.leftItem}`}
        style={{
          top: index * DEFAULT_HANDLE_HEIGHT,
          height: DEFAULT_HANDLE_HEIGHT,
        }}
        ref={(el) => {
          leftHandleListRef.current[index] = el!
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
          top: index * DEFAULT_HANDLE_HEIGHT,
          height: DEFAULT_HANDLE_HEIGHT,
        }}
        ref={(el) => {
          rightHandleListRef.current[index] = el!
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
}


export default HandleSection
