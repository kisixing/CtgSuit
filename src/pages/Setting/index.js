import React, { Component } from 'react'
import { Layout, Menu, Button } from 'antd';

// 各个模块
import BasicSetting from './BasicSetting';
import ScoreSet from './ScoreSet';
import Network from './Network';
import Alarm from './Alarm';
import Print from './Print';
import BedInfo from './BedInfo';
import Account from './Account';
import Hospital from './Hospital';
import VersionManager from './VersionManager';

import styles from './index.less';

const { Header, Sider } = Layout;

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: { label: '网络设置', value: '5' },
      results: {},
    };
  }

  handleMenuClick = e => {
    const {
      key,
      item: { props },
    } = e;
    const current = {
      label: props.children,
      value: key,
    };
    this.setState({ current });
  };

  menus = () => {
    const { current } = this.state;
    return (
      <Menu
        mode="inline"
        selectedKeys={[current.value]}
        onClick={this.handleMenuClick}
      >
        <Menu.Item key="5">网络设置</Menu.Item>
        <Menu.Item key="7">床位设置</Menu.Item>
        <Menu.Item key="6">医院设置</Menu.Item>
        <Menu.Item key="8">账号管理</Menu.Item>
        <Menu.Item key="9">CTG设置</Menu.Item>
        <Menu.Item key="3">打印设置</Menu.Item>
        {/* <Menu.Item key="2">评分设置</Menu.Item>
        <Menu.Item key="4">事件设置</Menu.Item> */}
        <Menu.Item key="1">维护设置</Menu.Item>
        <Menu.Item key="0">版本管理</Menu.Item>
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

  switchComponent = () => {
    const { current } = this.state;
    switch (current.value) {
      case '1':
        return <BasicSetting />;
      case '2':
        return <ScoreSet />;
      case '3':
        return <Print />;
      case '5':
        return <Network />;
      case '6':
        return <Hospital />
      case '7':
        return <BedInfo />
      case '8':
        return <Account />
      case '9':
        return <Alarm />;
      case '0':
        return <VersionManager />;
      default:
        break;
    }
  };

  render() {
    const { current } = this.state;
    return (
      <Layout className={styles.wrapper}>
        <Sider theme="light" width="256" className={styles.aside}>
          <div className={styles.sideMenu}>{this.menus()}</div>
        </Sider>
        <Layout className={styles.main}>
          <Header className={styles.headerTitle}>{`系统设置/${current.label}`}</Header>
          <Layout className={styles.formBox}>{this.switchComponent()}</Layout>
        </Layout>
      </Layout>
    );
  }
}

export default Setting;