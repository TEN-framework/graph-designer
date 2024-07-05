import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import styles from "./extension.module.scss"
 
// const handleStyle = { left: 10 };
 
export type ExtensionNodeProps = {
    name: string;
    cmd_inputs: { id: string; type: string }[];
    cmd_outputs: { id: string; type: string }[];
};

export default memo(({ data: {
    name,
    cmd_inputs = [],
    cmd_outputs = [],
}}: {
    data: ExtensionNodeProps;
}) => {
  return (
    <div className={styles['extension-node']} style={{height:20 + 20 * Math.max(cmd_inputs.length, cmd_outputs.length)}}>
      <div className={styles['contents']}>
        <div className={styles['extension-name']}>
          <strong>{name}</strong>
        </div>
        <div className={styles['extension-inputs']}>
          {/* <Handle type="target" position={Position.Left} /> */}
            {cmd_inputs.map((input:{ id: string; type: string }, index) => (
              <Handle 
                type="target"
                position={Position.Left}
                id={`${name}_${input.id}`}
                style={{ top: 20 + 20*index, background: '#555' }}
              >
                <div className={styles['extension-handle-label']}>{input.id}</div>
              </Handle>
            ))}
        </div>
        <div className={styles['extension-outputs']}>
          {cmd_outputs.map((output:{ id: string; type: string }, index) => (
            <Handle 
              type="source"
              position={Position.Right}
              id={`${name}_${output.id}`}
              style={{ top: 20 + 20*index, background: '#555' }}
            >
              <div className={styles['extension-handle-label']}>{output.id}</div>
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
  );
});