"use client"

import styles from "./index.module.scss"

const Sidebar = () => {

  const onDragStart = (event: any, name: string) => {
    console.log('drag started', event);
    event.dataTransfer.setData('type', "extension");
    event.dataTransfer.setData('name', name);
    event.dataTransfer.effectAllowed = 'move';
  }

  return <div className={styles.sidebar}>
    <div className={styles.item} draggable onDragStart={(e) => onDragStart(e,"agora_rtc")}>agora_rtc</div>
    <div className={styles.item} draggable onDragStart={(e) => onDragStart(e,"openai_chatgpt")}>openai_chatgpt</div>
    <div className={styles.item} draggable onDragStart={(e) => onDragStart(e,"azure_tts")}>azure_tts</div>
    <div className={styles.item} draggable onDragStart={(e) => onDragStart(e,"interrupt_detector")}>interrupt_detector</div>
    <div className={styles.item} draggable onDragStart={(e) => onDragStart(e,"chat_transcriber")}>chat_transcriber</div>
  </div>
}

export default Sidebar;
