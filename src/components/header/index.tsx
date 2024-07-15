"use client"

import { Button, Select, message } from "antd"
import { useEffect, useMemo, useState } from "react"
import { apiGetVersion, apiAllGetGraph, useAppSelector, useAppDispatch, apiUpdateGraph } from "@/common"
import { setCurGraphName } from "@/store/reducers/global"
import { IGraph } from "@/types"

import styles from "./index.module.scss"

const Header = () => {
  const [messageApi, contextHolder] = message.useMessage();
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
        label: item.name,
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
    try {
      // TODO: save graph
      await apiUpdateGraph(curGraphName, {})
      messageApi.success("Save success")
    } catch (e) {
      messageApi.error("Failed to save")
    }

  }

  return (
    <>
      {contextHolder}
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
    </>

  )
}

export default Header
