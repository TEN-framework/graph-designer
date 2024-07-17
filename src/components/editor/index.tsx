"use client"

import Flow from "@/components/editor/flow"

import "@xyflow/react/dist/style.css"
import styles from "./index.module.scss"

const Editor = () => {
  return (
    <div className={styles.editor}>
      <Flow></Flow>
    </div>
  )
}

export default Editor
