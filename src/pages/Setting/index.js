import React, { Component } from 'react'
import { Layout, Menu, Button } from 'antd';

// 各个模块
import BasicSetting from './BasicSetting';
import ScoreSet from './ScoreSet';
import Network from './Network';
import Alarm from './Alarm';
import BedInfo from './BedInfo';

import styles from './index.less';

const { Header, Sider, Footer } = Layout;

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: { label: '基础设置', value: '1' },
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

  handleSubmit = e => {
    e.preventDefault();
    // 获取全部表单数据
    let form1 = {};
    let form2 = {};
    let form3 = {};
    let form4 = {};
    let form5 = {};
    let form6 = {};
    let form7 = {};
    this.form1.props.form.validateFields((err, values) => {
      if (!err) {
        form1 = values;
        console.log('Received values of form: ', values);
      }
    });
    this.form2.props.form.validateFields((err, values) => {
      if (!err) {
        form2 = values;
        console.log('Received values of form: ', values);
      }
    });
    this.setState({
      results: {
        form1,
        form2,
        form3,
        form4,
        form5,
        form6,
        form7,
      },
    });
  };

  menus = () => {
    const { current } = this.state;
    return (
      <Menu
        mode="inline"
        selectedKeys={[current.value]}
        onClick={this.handleMenuClick}
      >
        <Menu.Item key="1">基础设置</Menu.Item>
        <Menu.Item key="2">评分设置</Menu.Item>
        <Menu.Item key="3">打印设置</Menu.Item>
        <Menu.Item key="4">事件设置</Menu.Item>
        <Menu.Item key="5">网络设置</Menu.Item>
        <Menu.Item key="7">床位设置</Menu.Item>
        <Menu.Item key="6">医院设置</Menu.Item>
        <Menu.Item key="8">版本信息</Menu.Item>
        <Menu.Item key="9">报警设置</Menu.Item>
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
        return <BasicSetting wrappedComponentRef={form => (this.form1 = form)} />;
      case '2':
        return <ScoreSet wrappedComponentRef={form => (this.form2 = form)} />;
      case '5':
        return <Network wrappedComponentRef={form => (this.form5 = form)} />;
      case '7':
        return <BedInfo />
      case '9':
        return <Alarm  wrappedComponentRef={form => (this.form9 = form)} />;
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