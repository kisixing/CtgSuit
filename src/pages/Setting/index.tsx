import React, { useState, useEffect } from 'react'
import { Layout, Menu, message } from 'antd';
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
const Setting = ({ isAdmin }) => {

  const [current, setCurrent] = useState('Network' || Object.keys(settingMap)[0])
  const handleMenuClick = e => {
    const {
      key,
    } = e;
    setCurrent(key)
  };
  useEffect(() => {
    isAdmin || message.info('非管理员只能查看系统设置，如需修改请联系管理员')
  }, [isAdmin])
  const menus = () => {

    return (
      <Menu
        mode="inline"
        selectedKeys={[current]}
        onClick={handleMenuClick}
        style={{ fontWeight: "bold" }}
      >

        <Menu.ItemGroup key="g2" title="常规">
          {
            Object.entries(settingMap).map(([k, v]) => {
              return v ? <Menu.Item key={k} style={{ fontWeight: "normal" }}>{v.displayName}</Menu.Item> : null
            })
          }

        </Menu.ItemGroup>
        <Menu.Item key="alarm" style={{ color: 'var(--customed-font)', fontWeight: "bold" }}><span style={{ marginLeft: -12, }}>报警设置</span></Menu.Item>


      </Menu>
    );
  };

  const switchComponent = () => {
    const T = settingMap[current] || (current === 'alarm' ? Alarm : () => null)
    return <T isAdmin={isAdmin} />
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
    account: global.account,
    isAdmin: global.isAdmin
  }),
)(Setting);


export default P