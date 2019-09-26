import React, { Component } from 'react'
import { Layout, Menu, Icon } from 'antd';
import FieldForm from './FieldForm';
import TableList from './TableList';
import CurveChart from './CurveChart';

import styles from './index.less';

const { Sider } = Layout;

class Archives extends Component {

  render() {
    return (
      <Layout className={styles.wrapper}>
        {/* <Sider theme="light" width="320" className={styles.aside}></Sider> */}
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <TableList />
          </div>
          <div className={styles.topRight}>
            <FieldForm />
          </div>
        </div>
        <Layout className={styles.bottom}>
          <div className={styles.line}>
            <h2>电脑胎儿监护图</h2>
            <CurveChart />
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default Archives;