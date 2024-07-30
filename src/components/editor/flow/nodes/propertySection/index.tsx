import { Popover, Input } from 'antd';
import { IExtensionProperty } from "@/types"
import PropertyItem from "./item"
import { InfoCircleOutlined } from "@ant-design/icons"
import styles from "./index.module.scss"


interface PropertySectionProps {
  property?: IExtensionProperty
  onUpdate?: (key: string, value: any) => void
}

const PropertySection = (props: PropertySectionProps) => {
  const { property, onUpdate } = props

  const content = (
    <div className={styles.contentSection}>
      {property && Object.keys(property).map((key, index) => {
        return <PropertyItem
          key={index}
          name={key}
          propertyType={property[key].type}
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
