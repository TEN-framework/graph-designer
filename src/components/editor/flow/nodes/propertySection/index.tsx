import { Popover, Input } from 'antd';
import { IExtensionProperty, IExtensionPropertyTypes } from "@/types"
import PropertyItem from "./item"
import { InfoCircleOutlined } from "@ant-design/icons"
import styles from "./index.module.scss"
import { useMemo } from 'react';


interface PropertySectionProps {
  property?: IExtensionProperty
  propertyTypes?: IExtensionPropertyTypes
  onUpdate?: (key: string, value: any) => void
}

const PropertySection = (props: PropertySectionProps) => {
  const { property, onUpdate, propertyTypes } = props

  const propertyKeyList = useMemo(() => {
    return propertyTypes ? Object.keys(propertyTypes).sort((a: string, b: string) => a > b ? 1 : -1) : []
  }, [propertyTypes])

  const content = (
    <div className={styles.contentSection}>
      {propertyKeyList.map((key, index) => {
        return <PropertyItem
          value={property?.[key]}
          key={index}
          name={key}
          propertyType={propertyTypes?.[key].type}
          onUpdate={value => onUpdate?.(key, value)}></PropertyItem>
      })}
    </div>
  );

  return property ? <div className={styles.property} >
    <span className={styles.title}>property</span>
    <Popover content={content} rootClassName={styles.propertyPopover}>
      <InfoCircleOutlined></InfoCircleOutlined>
    </Popover>
  </div > : <></>
}



export default PropertySection
