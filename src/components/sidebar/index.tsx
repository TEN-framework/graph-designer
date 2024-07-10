"use client"

import { useEffect, useState } from "react"
import { apiGetInstalledExtension, apiAllGetGraph } from "@/common"
import styles from "./index.module.scss"



const Sidebar = ({ data }: any) => {
  const [extensionArr, setExtensionArr] = useState<IExtension[]>([])

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const data = await apiGetInstalledExtension()
    setExtensionArr(data)
  }

  const onDragStart = (event: any, name: string) => {
    console.log("drag started", event)
    event.dataTransfer.setData("type", "extension")
    event.dataTransfer.setData("name", name)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className={styles.sidebar}>
      {extensionArr.map((item) => {
        return <div
          className={styles.item}
          key={item.name}
          draggable
          onDragStart={(e) => onDragStart(e, item.name)}>{item.name}</div>
      })}
    </div>
  )
}

export default Sidebar
