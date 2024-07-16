"use client"

import { useNodes, useEdges } from "reactflow"
import { Button, Select, message } from "antd"
import { useEffect, useMemo, useState } from "react"
import {
  apiGetVersion, apiAllGetGraph, useAppSelector,
  useAppDispatch, apiUpdateGraph, sleep,
  edgesToConnections, nodesToExtensions
} from "@/common"
import { setCurGraphName } from "@/store/reducers/global"
import { IGraph, IGraphData } from "@/types"

import styles from "./index.module.scss"

const Header = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch()
  const nodes = useNodes();
  const edges = useEdges();
  const curGraphName = useAppSelector((state) => state.global.curGraphName)
  const installedExtensions = useAppSelector((state) => state.global.installedExtensions)
  const [version, setVersion] = useState("")
  const [graphArr, setGraphArr] = useState<IGraph[]>([])
  const [loading, setLoading] = useState(false)



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
      setLoading(true)
      const curGraph = graphArr.find(item => item.name == curGraphName)
      const extensions = nodesToExtensions(nodes, installedExtensions)
      const connections = edgesToConnections(edges)

      console.log("onClickSave extensions", extensions)
      console.log("onClickSave connections", connections)

      await apiUpdateGraph(curGraphName, {
        auto_start: !!curGraph?.auto_start,
        extensions: extensions,
        connections: connections
      })
      messageApi.success("Save success")
    } catch (e: any) {
      messageApi.error("Failed to save ", e.message)
    } finally {
      setLoading(false)
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
        <Button className={styles.save} type="primary" loading={loading} onClick={onClickSave}>
          Save
        </Button>
      </div>
    </>

  )
}

export default Header
