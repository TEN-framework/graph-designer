import { useRef, useState, useEffect, LegacyRef, useMemo } from "react"
import { NodeProps } from "@xyflow/react"
import { eventManger } from "@/manager"
import { NodeStatus, ExtensionNode } from "@/types"
import { Input } from "antd"
import { DEFAULT_NODE_WIDTH } from "@/common"
import PropertySection from "./propertySection"
import HandleSection from "./handleSection"
import styles from "./index.module.scss"

const getNodeColor = (status?: NodeStatus) => {
  if (status == "disabled") {
    return "#ff1e1e"
  } else if (status == "enabled") {
    return "#38ff1e"
  }

  return "#E5E7EB"
}

export default function ExtensionNodeComponent(
  props: NodeProps<ExtensionNode>,
) {
  const { data } = props
  const {
    name,
    inputs = [],
    outputs = [],
    status = "default",
    property,
    propertyTypes,
    extensionGroup: propExtensionGroup = "default",
  } = data

  const [extensionGroup, setExtensionGroup] = useState(propExtensionGroup)
  const [nodeWidth, setNodeWidth] = useState(DEFAULT_NODE_WIDTH)

  const onHandleWidthChange = (width: number) => {
    setNodeWidth(width)
  }

  const onExtensionGroupBlur = () => {
    if (extensionGroup !== propExtensionGroup) {
      eventManger.emit("extentionGroupChanged", name, extensionGroup)
    }
  }

  const onUpdateProperty = (key: string, value: string) => {
    eventManger.emit("extentionPropertyChanged", name, key, value)
  }

  return (
    <div
      className={styles.extensionNode}
      style={{
        borderColor: getNodeColor(status),
        width: nodeWidth,
      }}
    >
      <div className={styles.extensionName}>
        <span className={styles.text}>{name}</span>
      </div>
      {/* property */}
      <PropertySection property={property} propertyTypes={propertyTypes} onUpdate={onUpdateProperty}></PropertySection>
      {/* extensionGroup */}
      <div className={styles.extensionGroup}>
        <div className={styles.title}>extensionGroup</div>
        <Input
          size="small"
          value={extensionGroup}
          onChange={(e) => setExtensionGroup(e.target.value)}
          onBlur={onExtensionGroupBlur}
        ></Input>
      </div>
      {/* handle */}
      <HandleSection inputs={inputs} outputs={outputs} onHandleWidthChange={onHandleWidthChange}></HandleSection>
    </div>
  )
}
