import React, { Component } from 'react'
import { Layout, Menu, Button } from 'antd';

// 各个模块
import BasicSetting from './BasicSetting';
import ScoreSet from './ScoreSet';

import styles from './index.less';

const { Header, Sider, Footer } = Layout;

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentKey: ['1'],
    };
  }

  handleMenuClick = e => {
    const key = e.key;
    this.setState({ currentKey: [key] });
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
  };

  menus = () => {
    const { currentKey } = this.state;
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        selectedKeys={currentKey}
        onClick={this.handleMenuClick}
      >
        <Menu.Item key="1">基础设置</Menu.Item>
        <Menu.Item key="2">评分设置</Menu.Item>
        <Menu.Item key="3">打印设置</Menu.Item>
        <Menu.Item key="4">事件设置</Menu.Item>
        <Menu.Item key="5">网络设置</Menu.Item>
        <Menu.Item key="6">医院设置</Menu.Item>
        <Menu.Item key="7">版本信息</Menu.Item>
      </Menu>
    );
  };

  switchComponent = () => {
    const { currentKey } = this.state;
    switch (currentKey[0]) {
      case '1':
        return <BasicSetting wrappedComponentRef={form => (this.form1 = form)} />;
        break;
      case '2':
        return <ScoreSet wrappedComponentRef={form => (this.form2 = form)} />;
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <Layout className={styles.wrapper}>
        <Sider theme="light" width="256" className={styles.aside}>
          <div className={styles.menuBox}>{this.menus()}</div>
        </Sider>
        <Layout className={styles.main}>
          <Header className={styles.headerTitle}>系统设置</Header>
          <Layout className={styles.formBox}>{this.switchComponent()}</Layout>
          <Footer className={styles.footer}>
            <Button>取消</Button>
            <Button type="primary" onClick={this.handleSubmit}>
              保存
            </Button>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Setting;