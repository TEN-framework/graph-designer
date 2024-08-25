import { Popover, Input, Form, Checkbox, Button, Card, Select, Dropdown, Typography, Space, MenuProps } from 'antd';
import { IExtensionProperty, IExtensionPropertyTypes } from "@/types"
import PropertyItem from "./item"
import { DownOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import styles from "./index.module.scss"
import { useMemo, useState } from 'react';
import { getDefaultValueByPropertyType } from '@/common';


interface PropertySectionProps {
  property?: IExtensionProperty | null
  propertyTypes?: IExtensionPropertyTypes
  onUpdate?: (key: string, value: any) => void
}

const PropertySection = (props: PropertySectionProps) => {
  const { property, onUpdate, propertyTypes } = props

  const propertyKeyList = useMemo(() => {
    return propertyTypes ? Object.keys(propertyTypes).sort((a: string, b: string) => a > b ? 1 : -1) : []
  }, [propertyTypes])

  const propertiesMenu = useMemo(() => {
    return propertyKeyList.map((key, index) => {
      return {
        key: key,
        label: key,
        className: styles.menuItem,
      }
    })
  }, [propertyKeyList])

  const availableProperties = useMemo(() => {
    return propertyTypes ? propertyKeyList.filter(key => property?.[key] !== undefined) : []
  }, [property, propertyKeyList])

  const content = (
    <Card 
      title="Properties"
      extra={(
        <Dropdown
          overlayStyle={{maxHeight: 400, overflow: 'auto'}}
          menu={{
            items: propertiesMenu,
            defaultSelectedKeys: Object.keys(property || {}),
            multiple: true,
            selectable: true,
            onSelect: ({key}) => {
              if (propertyTypes && propertyTypes?.[key]) {
                onUpdate?.(key, getDefaultValueByPropertyType(propertyTypes[key].type))
              }
            },
            onDeselect: ({key}) => {
              onUpdate?.(key, undefined)
            }
          }}
        >
          <Typography.Link>
            <Space>
              Edit Properties
              <DownOutlined />
            </Space>
          </Typography.Link>
        </Dropdown>
      )} 
      bordered={false}
      styles={{body: {padding: 0}}}
    >
      <Form
        name="basic"
        layout='vertical'
        className={styles.contentSection}
        wrapperCol={{ flex: 1 }}
        initialValues={{ remember: true }}
        onFinish={() =>{}}
        onFinishFailed={() =>{}}
        autoComplete="off"
      >
        {availableProperties.map((key, index) => {
          return <PropertyItem
            value={property?.[key]}
            key={index}
            name={key}
            propertyType={propertyTypes?.[key]?.type}
            onUpdate={value => onUpdate?.(key, value)}></PropertyItem>
        })}
      </Form>
    </Card>
  );

  return propertyKeyList.length > 0 ? <div className={styles.property} >
    <span className={styles.title}>property</span>
    <Popover overlayInnerStyle={{padding:0}} content={content} rootClassName={styles.propertyPopover} trigger={"click"}>
      <EditOutlined></EditOutlined>
    </Popover>
  </div > : <></>
}



export default PropertySection
