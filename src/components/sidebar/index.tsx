"use client"

import { useEffect, useState } from "react"
import { apiGetInstalledExtension, useAppDispatch, useAppSelector } from "@/common"
import { setInstalledExtensions } from "@/store/reducers/global"
import { IExtension } from "@/types"
import styles from "./index.module.scss"


const Sidebar = () => {
  const dispatch = useAppDispatch()
  const installedExtensions = useAppSelector((state) => state.global.installedExtensions)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const data = await apiGetInstalledExtension()
    console.log("installed extensions: ", data)
    dispatch(setInstalledExtensions(data))
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
