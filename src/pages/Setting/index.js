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
      currentKey: ['form1'],
      results: {},
    };
  }

  handleMenuClick = e => {
    const key = e.key;
    this.scrollToAnchor(key);
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
    const { currentKey } = this.state;
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        selectedKeys={currentKey}
        onClick={this.handleMenuClick}
      >
        <Menu.Item key="form1">基础设置</Menu.Item>
        <Menu.Item key="form2">评分设置</Menu.Item>
        <Menu.Item key="form3">打印设置</Menu.Item>
        <Menu.Item key="form4">事件设置</Menu.Item>
        <Menu.Item key="form5">网络设置</Menu.Item>
        <Menu.Item key="form6">医院设置</Menu.Item>
        <Menu.Item key="form7">版本信息</Menu.Item>
      </Menu>
    );
  };

  //函数定义
  scrollToAnchor = anchorName => {
    if (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
  };

  // switchComponent = () => {
  //   const { currentKey } = this.state;
  //   switch (currentKey[0]) {
  //     case '1':
  //       return <BasicSetting wrappedComponentRef={form => (this.form1 = form)} />;
  //       break;
  //     case '2':
  //       return <ScoreSet wrappedComponentRef={form => (this.form2 = form)} />;
  //       break;
  //     default:
  //       break;
  //   }
  // };

  render() {
    return (
      <Layout className={styles.wrapper}>
        <Sider theme="light" width="256" className={styles.aside}>
          <div className={styles.sideMenu}>{this.menus()}</div>
        </Sider>
        <Layout className={styles.main}>
          <Header className={styles.headerTitle}>系统设置</Header>
          <Layout className={styles.formBox}>
            {/* {this.switchComponent()} */}
            <div className={styles.scrollView}>
              <BasicSetting id="form1" wrappedComponentRef={form => (this.form1 = form)} />
              <ScoreSet id="form2" wrappedComponentRef={form => (this.form2 = form)} />
              <BasicSetting wrappedComponentRef={form => (this.form1 = form)} />
              <ScoreSet wrappedComponentRef={form => (this.form2 = form)} />
              <BasicSetting wrappedComponentRef={form => (this.form1 = form)} />
              <ScoreSet wrappedComponentRef={form => (this.form2 = form)} />
              <BasicSetting wrappedComponentRef={form => (this.form1 = form)} />
              <ScoreSet wrappedComponentRef={form => (this.form2 = form)} />
              <BasicSetting wrappedComponentRef={form => (this.form1 = form)} />
              <ScoreSet wrappedComponentRef={form => (this.form2 = form)} />
            </div>
            <div>{JSON.stringify(this.state.results)}</div>
          </Layout>
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