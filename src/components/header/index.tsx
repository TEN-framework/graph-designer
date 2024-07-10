"use client"

import { Button, Select } from "antd"
import { useEffect, useMemo, useState } from "react"
import { apiGetVersion, apiAllGetGraph, useAppSelector, useAppDispatch } from "@/common"
import { setCurGraphName } from "@/store/reducers/global"
import { IGraph } from "@/types"

import styles from "./index.module.scss"




const Header = () => {
  const dispatch = useAppDispatch()
  const curGraphName = useAppSelector((state) => state.global.curGraphName)
  const [version, setVersion] = useState("")
  const [graphArr, setGraphArr] = useState<IGraph[]>([])

  useEffect(() => {
    init()
  }, [])


  const options = useMemo(() => {
    return graphArr.map((item) => {
      return {
        value: item.name,
        label: "Graph" + item.name,
      }
    })
  }, [graphArr])

  const init = async () => {
    const data = await apiGetVersion()
    setVersion(data.version)
    const graphs = await apiAllGetGraph()
    setGraphArr(graphs)
    if (graphs.length) {
      dispatch(setCurGraphName(graphs[0].name))
    }
  }

  const onClickSave = async () => {
    // TODO: Implement save logic
    console.log("Save clicked")
  }

  return (
    <div className={styles.header}>
      <span className={styles.version}>version:{version}</span>
      <span className={styles.content}>
        <Select
          className={styles.graph}
          value={curGraphName}
          options={options}
          onChange={(value) => dispatch(setCurGraphName(value))}
        ></Select>
      </span>
      <Button className={styles.save} type="primary" onClick={onClickSave}>
        Save
      </Button>
    </div>
  )
}

export default Header
