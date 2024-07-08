"use client";

import { Button, Select } from 'antd';
import styles from "./index.module.scss"
import { useState } from 'react';

const options = [{
  value: 'graph1', label: 'Graph1',
}, {
  value: 'graph2', label: 'Graph2',
}, {
  value: 'graph3', label: 'Graph3',
}]


const Header = () => {
  const [graph, setGraph] = useState(options[0].value)

  const onClickSave = async () => {
    // TODO: Implement save logic
    console.log('Save clicked');
  }

  return <div className={styles.header}>
    <span className={styles.content}>
      <Select className={styles.graph} value={graph} options={options} onChange={value => setGraph(value)}></Select>
    </span>
    <Button className={styles.save} type="primary" onClick={onClickSave}>Save</Button>
  </div>
}



export default Header;
