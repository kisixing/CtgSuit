import React, { Component } from 'react'
import { Layout, Menu, Icon } from 'antd';

import styles from './index.less';

const { Sider } = Layout;

class Archives extends Component {

  render() {
    return (
      <Layout className={styles.wrapper}>
        <Sider theme="light" width="320" className={styles.aside}></Sider>
        <Layout>layout</Layout>
      </Layout>
    );
  }
}

export default Archives;