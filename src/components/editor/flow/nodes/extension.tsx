import { memo, useCallback } from "react"
import { Handle, Position } from "reactflow"
import styles from "./extension.module.scss"

// const handleStyle = { left: 10 };

export type ExtensionNodeProps = {
  name: string
  inputs: { id: string; type: string }[]
  outputs: { id: string; type: string }[]
}

const HEADER_HEIGHT = 30,
  HANDLE_HEIGHT = 20

// eslint-disable-next-line react/display-name
export default memo(
  ({
    data: { name, inputs = [], outputs = [] },
  }: {
    data: ExtensionNodeProps
  }) => {
    return (
      <div
        className={styles["extension-node"]}
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
            {/* <Handle type="target" position={Position.Left} /> */}
            {inputs.map((input: { id: string; type: string }, index) => (
              <Handle
                key={`${name}/${input.id}`}
                type="target"
                position={Position.Left}
                id={`${name}/${input.id}`}
                style={{
                  top: HEADER_HEIGHT + HANDLE_HEIGHT * index,
                  background: "#555",
                }}
              >
                <div className={styles["extension-handle-label"]}>
                  {input.id}
                </div>
              </Handle>
            ))}
          </div>
          <div className={styles["extension-outputs"]}>
            {outputs.map((output: { id: string; type: string }, index) => (
              <Handle
                key={`${name}/${output.id}`}
                type="source"
                position={Position.Right}
                id={`${name}/${output.id}`}
                style={{
                  top: HEADER_HEIGHT + HANDLE_HEIGHT * index,
                  background: "#555",
                }}
              >
                <div className={styles["extension-handle-label"]}>
                  {output.id}
                </div>
              </Handle>
            ))}
          </div>
          {/* <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: 10, background: '#555'}}>
            <div style={{pointerEvents: 'none'}}>hello</div>
      </Handle>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{ bottom: 10, top: 'auto', background: '#555' }}
        // style={handleStyle}
      /> */}
        </div>
      </div>
    )
  },
)
