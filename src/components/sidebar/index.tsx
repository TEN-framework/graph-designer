"use client"

import { useEffect, useState } from "react"
import { apiGetInstalledExtension } from "@/common"
import { IExtension } from "@/types"
import styles from "./index.module.scss"


const Sidebar = () => {
  const [installedExtensions, setInstalledExtensions] = useState<IExtension[]>([])

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const data = await apiGetInstalledExtension()
    console.log("installed extensions: ", data)
    setInstalledExtensions(data)
  }

  const onDragStart = (event: any, item: IExtension) => {
    console.log("drag started", item)
    event.dataTransfer.setData("type", "extension")
    event.dataTransfer.setData("extension", JSON.stringify(item))
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className={styles.sidebar}>
      {installedExtensions.map((item) => {
        return <div
          className={styles.item}
          key={item.name}
          draggable
          onDragStart={(e) => onDragStart(e, item)}>{item.name}</div>
      })}
    </div>
  )
}

export default Sidebar
