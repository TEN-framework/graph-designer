"use client";

import { useCallback, useEffect } from 'react';
import { ReactFlowProvider } from "reactflow"
import Flow from "@/components/editor/flow"
import { logger } from "@/common"

import 'reactflow/dist/style.css';
import styles from "./index.module.scss"



const Editor = () => {


  return <div className={styles.editor}>
    <ReactFlowProvider>
      <Flow></Flow>
    </ReactFlowProvider>
  </div>
}


export default Editor;
