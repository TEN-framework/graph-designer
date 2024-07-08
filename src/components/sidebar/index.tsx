"use client"

import { DragEventHandler } from "react"
import styles from "./index.module.scss"

const Sidebar = () => {
  const onDragStart = (event: DragEventHandler<HTMLDivElement>) => {
    console.log('drag started', event);

  }

  return <div className={styles.sidebar}>
    <div className={styles.item} onDragStart={onDragStart}>agora_rtc</div>
    <div className={styles.item} onDragStart={onDragStart}>openai_chatgpt</div>
    <div className={styles.item} onDragStart={onDragStart}>azure_tts</div>
    <div className={styles.item} onDragStart={onDragStart}>interrupt_detector</div>
    <div className={styles.item} onDragStart={onDragStart}>chat_transcriber</div>
  </div>
}

export default Sidebar;
