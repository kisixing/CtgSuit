import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd';
import { connect } from 'dva';
import store from 'store';
import { uncompile } from '@/utils/utils';
// 各个模块
// import BasicSetting from './BasicSetting';
// import ScoreSet from './ScoreSet';
import Alarm from './Alarm';
// import VersionManager from './VersionManager';
// import GroupAndWard from './GroupAndWard';
// import LayoutSetting from './LayoutSetting';
import Network from './Network';
import Print from './Print';
import Subscribe from './Subscribe/index';
import Account from './Account';
import Hospital from './Hospital';
// import Parameter from './Parameter';
import CtgParameter from './CtgParameter';

const styles = require('./index.less');

const account = store.get('ACCOUNT');
const username = uncompile(account.username);

const { Header, Sider } = Layout;
const settingMap = {
  Network,
  Hospital,
  Subscribe,
  Account: username === 'admin' ? Account : null,
  CtgParameter,
  // Parameter,
  Print,
}
const Setting = () => {

  const [current, setCurrent] = useState('alarm' || Object.keys(settingMap)[0])
  const handleMenuClick = e => {
    const {
      key,
    } = e;
    setCurrent(key)
  };

  const menus = () => {

    return (
      <Menu
        mode="inline"
        selectedKeys={[current]}
        onClick={handleMenuClick}
      >
        <Menu.ItemGroup key="g1" title="报警">
          <Menu.Item key="alarm">设置</Menu.Item>

        </Menu.ItemGroup>
        <Menu.ItemGroup key="g2" title="常规">
          {
            Object.entries(settingMap).map(([k, v]) => {
              return v ? <Menu.Item key={k}>{v.displayName}</Menu.Item> : null
            })
          }

        </Menu.ItemGroup>

      </Menu>
    );
  };

  //函数定义
  // scrollToAnchor = anchorName => {
  //   if (anchorName) {
  //     // 找到锚点
  //     let anchorElement = document.getElementById(anchorName);
  //     // 如果对应id的锚点存在，就跳转到锚点
  //     if (anchorElement) {
  //       anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
  //     }
  //   }
  // };

  const switchComponent = () => {
    const T = settingMap[current] || (current === 'alarm' ? Alarm : () => null)
    return <T />
  }


  return (
    <Layout className={styles.wrapper}>
      <Sider theme="light" width="256" className={styles.aside}>
        <div className={styles.sideMenu}>{menus()}</div>
      </Sider>
      <Layout className={styles.main}>
        <Header
          className={styles.headerTitle}
          style={{ display: 'none' }}
        >{`系统设置/${current}`}</Header>
        <Layout className={styles.formBox}>{switchComponent()}</Layout>
      </Layout>
    </Layout>
  );
}

const P = connect(
  ({ global }: any) => ({
    account: global.account
  }),
)(Setting);


export default P