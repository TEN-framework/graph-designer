"use client"

import { useNodes, useEdges } from "@xyflow/react"
import { Button, Select, message } from "antd"
import { use, useEffect, useMemo, useState } from "react"
import {
  LoadingOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons"
import {
  apiGetVersion,
  apiAllGetGraph,
  useAppSelector,
  useAppDispatch,
  apiSaveGraph
} from "@/common"
import { setAutoStart, setCurGraphName } from "@/store/reducers/global"
import { IGraph, IGraphData, IExtensionNode } from "@/types"

import styles from "./index.module.scss"

const Header = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const dispatch = useAppDispatch()
  const nodes = useNodes()
  const edges = useEdges()
  const curGraphName = useAppSelector((state) => state.global.curGraphName)
  const autoStart = useAppSelector((state) => state.global.autoStart)
  const installedExtensions = useAppSelector(
    (state) => state.global.installedExtensions,
  )
  const saveStatus = useAppSelector((state) => state.global.saveStatus)
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
      dispatch(setAutoStart(!!graphs[0].auto_start))
    }
  }

  const onGraphChange = (curGraphName: string) => {
    const curGraph = graphArr.find((item) => item.name == curGraphName)
    dispatch(setCurGraphName(curGraphName))
    dispatch(setAutoStart(!!curGraph?.auto_start))
  }

  const onClickSave = async () => {
    try {
      setLoading(true)
      await apiSaveGraph()
      messageApi.success("Save success")
    } catch (e: any) {
      messageApi.error("Failed to save ", e.message)
    } finally {
      setLoading(false)
    }
  }

  const SaveIcon = useMemo(() => {
    if (saveStatus == "saving") {
      return <LoadingOutlined className={styles.saveIcon}></LoadingOutlined>
    } else if (saveStatus == "success") {
      return <CheckOutlined className={styles.saveIcon}></CheckOutlined>
    } else if (saveStatus == "failed") {
      return <CloseOutlined className={styles.saveIcon}></CloseOutlined>
    }
  }, [saveStatus])

  const SaveText = useMemo(() => {
    if (saveStatus == "saving") {
      return "Saving..."
    } else if (saveStatus == "success") {
      return "Saved"
    } else if (saveStatus == "failed") {
      return "Save Failed"
    }
    return null
  }, [saveStatus])

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
            onChange={onGraphChange}
          ></Select>
          <span className={styles.saveContent}>
            {SaveIcon}
            {SaveText}
          </span>
        </span>
        <Button
          className={styles.saveBtn}
          type="primary"
          loading={loading}
          onClick={onClickSave}
        >
          Save
        </Button>
      </div>
    </>
  )
}

export default Header
